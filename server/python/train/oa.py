# 导入需要用到的库

import random
import os.path as osp

import cv2
import numpy as np
import paddle
import paddlers as pdrs
from paddlers import transforms as T
from matplotlib import pyplot as plt
from PIL import Image

# paddle.device.set_device('gpu:1')
# 数据集路径，如果你训要训练该模型，你需要改变模型的路径
DATA_PATH='/home/luorun/cd2022space/Data'
EXP_PATH='/home/luorun/cd2022space/exp'
# 随机种子
SEED = 56961
# 数据集存放目录
DATA_DIR = osp.join(DATA_PATH,'massroad')
# 训练集`file_list`文件路径
TRAIN_FILE_LIST_PATH = DATA_DIR+'/train.txt'
# 验证集`file_list`文件路径
VAL_FILE_LIST_PATH = DATA_DIR+'/val.txt'
# 测试集`file_list`文件路径
TEST_FILE_LIST_PATH = DATA_DIR+'/test.txt'
# 数据集类别信息文件路径
LABEL_LIST_PATH = DATA_DIR+'/labels.txt'
# 实验目录，保存输出的模型权重和结果
EXP_DIR =  osp.join(EXP_PATH,'oa_exp')



# 固定随机种子，尽可能使实验结果可复现

random.seed(SEED)
np.random.seed(SEED)
paddle.seed(SEED)


# 构建数据集

# 定义训练和验证时使用的数据变换（数据增强、预处理等）
train_transforms = T.Compose([
    # 随机裁剪
    T.RandomCrop(crop_size=512),
    # 以50%的概率实施随机水平翻转
    T.RandomHorizontalFlip(prob=0.5),
    # 以50%的概率实施随机垂直翻转
    T.RandomVerticalFlip(prob=0.5),
    # 将数据归一化到[-1,1]
    T.Normalize(
        mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

eval_transforms = T.Compose([
    T.Resize(target_size=1488),
    # 验证阶段与训练阶段的数据归一化方式必须相同
    T.Normalize(
        mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

# 分别构建训练和验证所用的数据集
train_dataset = pdrs.datasets.SegDataset(
    data_dir=DATA_DIR,
    file_list=TRAIN_FILE_LIST_PATH,
    label_list=LABEL_LIST_PATH,
    transforms=train_transforms,
    num_workers=4,
    shuffle=True
)

val_dataset = pdrs.datasets.SegDataset(
    data_dir=DATA_DIR,
    file_list=VAL_FILE_LIST_PATH,
    label_list=LABEL_LIST_PATH,
    transforms=eval_transforms,
    num_workers=0,
    shuffle=False
)


# 构建DeepLab V3+模型，使用ResNet-50作为backbone
model = pdrs.tasks.DeepLabV3P(
    input_channel=3,
    num_classes=len(train_dataset.labels),
    backbone='ResNet50_vd'
)
model.net_initialize(
    pretrain_weights='CITYSCAPES',
    save_dir=osp.join(EXP_DIR, 'pretrain'),
    resume_checkpoint=None,
    is_backbone_weights=False
)

# 构建优化器
optimizer = paddle.optimizer.Adam(
    learning_rate=0.001, 
    parameters=model.net.parameters()
)


# 执行模型训练
model.train(
    num_epochs=100,
    train_dataset=train_dataset,
    train_batch_size=8,
    eval_dataset=val_dataset,
    optimizer=optimizer,
    save_interval_epochs=1,
    # 每多少次迭代记录一次日志
    log_interval_steps=30,
    save_dir=EXP_DIR,
    # 是否使用early stopping策略，当精度不再改善时提前终止训练
    early_stop=False,
    # 是否启用VisualDL日志功能
    use_vdl=True,
    # 指定从某个检查点继续训练
    resume_checkpoint=None
)


# 构建测试集
test_dataset = pdrs.datasets.SegDataset(
    data_dir=DATA_DIR,
    file_list=TEST_FILE_LIST_PATH,
    label_list=LABEL_LIST_PATH,
    transforms=eval_transforms,
    num_workers=0,
    shuffle=False
)

# 为模型加载历史最佳权重
state_dict = paddle.load(osp.join(EXP_DIR, 'best_model/model.pdparams'))
model.net.set_state_dict(state_dict)

# 执行测试
test_result = model.evaluate(test_dataset)
print(
    "测试集上指标：IoU为{:.2f}，Acc为{:.2f}，Kappa系数为{:.2f}, F1为{:.2f}".format(
        test_result['category_iou'][1], 
        test_result['category_acc'][1],
        test_result['kappa'],
        test_result['category_F1-score'][1]
    )
)

# 预测结果可视化
# 重复运行本单元可以查看不同结果

def read_image(path):
    im = cv2.imread(path)
    return im[...,::-1]


def show_images_in_row(ims, fig, title='', quantize=False):
    n = len(ims)
    fig.suptitle(title)
    axs = fig.subplots(nrows=1, ncols=n)
    for idx, (im, ax) in enumerate(zip(ims, axs)):
        # 去掉刻度线和边框
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_visible(False)
        ax.spines['left'].set_visible(False)
        ax.get_xaxis().set_ticks([])
        ax.get_yaxis().set_ticks([])

        if isinstance(im, str):
            im = read_image(im)
        if quantize:
            im = (im*255).astype('uint8')
        if im.ndim == 2:
            im = np.tile(im[...,np.newaxis], [1,1,3])
        ax.imshow(im)


# 需要展示的样本个数
num_imgs_to_show = 4
# 随机抽取样本
chosen_indices = random.choices(range(len(test_dataset)), k=num_imgs_to_show)

# 参考 https://stackoverflow.com/a/68209152
fig = plt.figure(constrained_layout=True)
fig.suptitle("Test Results")

subfigs = fig.subfigures(nrows=3, ncols=1)

# 读取输入影像并显示
im_paths = [test_dataset.file_list[idx]['image'] for idx in chosen_indices]
show_images_in_row(im_paths, subfigs[0], title='Image')

# 获取模型预测输出
with paddle.no_grad():
    model.net.eval()
    preds = []
    for idx in chosen_indices:
        input,mask= test_dataset[idx]
        input = paddle.to_tensor(input).unsqueeze(0)
        logits, *_ = model.net(input)
        pred = paddle.argmax(logits[0], axis=0)
        preds.append(pred.numpy())
show_images_in_row(preds, subfigs[1], title='Pred', quantize=True)

# 读取真值标签并显示
im_paths = [test_dataset.file_list[idx]['mask'] for idx in chosen_indices]
show_images_in_row(im_paths, subfigs[2], title='GT', quantize=True)

# 渲染结果
fig.canvas.draw()
Image.frombytes('RGB', fig.canvas.get_width_height(), fig.canvas.tostring_rgb())
plt.savefig('fig_oa.png')