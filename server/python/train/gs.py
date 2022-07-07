# # 划分训练集/验证集/测试集，并生成文件名列表
# # 注意，作为演示，本项目仅使用原数据集的训练集，即用来测试的数据也来自原数据集的训练集

# import random
# import os.path as osp
# from os import listdir

# import cv2


# # 随机数生成器种子
# RNG_SEED = 77571
# # 调节此参数控制训练集数据的占比
# TRAIN_RATIO = 0.9
# # 调节此参数控制验证集数据的占比
# VAL_RATIO = 0.05
# # 使用的样本个数（选取排序靠前的样本）
# NUM_SAMPLES_TO_USE = 10000
# # 数据集路径
# DATA_DIR = '/home/hust/Data/train_and_label'

# # 分割类别
# CLASSES = (
#     'cls0',
#     'cls1',
#     'cls2',
#     'cls3'
# )


# def has_valid_pixel(name):
#     path = osp.join(DATA_DIR, 'lab_train', name)
#     im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
#     if (im!=255).sum() == 0:
#         return False
#     return True


# def write_rel_paths(phase, names, out_dir):
#     """将文件相对路径存储在txt格式文件中"""
#     with open(osp.join(out_dir, phase+'.txt'), 'w') as f:
#         for name in names:
#             f.write(
#                 ' '.join([
#                     osp.join('img_train', name.replace('.png', '.jpg')),
#                     osp.join('lab_train', name)
#                 ])
#             )
#             f.write('\n')


# random.seed(RNG_SEED)

# names = listdir(osp.join(DATA_DIR, 'lab_train'))
# names = list(filter(has_valid_pixel, names))
# # 对文件名进行排序，以确保多次运行结果一致
# names.sort()
# if NUM_SAMPLES_TO_USE is not None:
#     names = names[:NUM_SAMPLES_TO_USE]
# random.shuffle(names)
# len_train = int(len(names)*TRAIN_RATIO)
# len_val = int(len(names)*VAL_RATIO)
# write_rel_paths('train', names[:len_train], DATA_DIR)
# write_rel_paths('val', names[len_train:len_train+len_val], DATA_DIR)
# write_rel_paths('test', names[len_train+len_val:], DATA_DIR)

# # 写入类别信息
# with open(osp.join(DATA_DIR, 'labels.txt'), 'w') as f:
#     for cls in CLASSES:
#         f.write(cls+'\n')

# print("数据集划分已完成。")



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
# paddle.device.set_device('gpu:2')

# 数据集路径，如果你训要训练该模型，你需要改变模型的路径
DATA_PATH='/home/luorun/cd2022space/Data'
EXP_PATH='/home/luorun/cd2022space/exp'
# 随机种子
SEED = 77571
# 数据集存放目录
DATA_DIR = osp.join(DATA_PATH,'train_and_label')
# 训练集`file_list`文件路径
TRAIN_FILE_LIST_PATH = DATA_DIR+'/train.txt'
# 验证集`file_list`文件路径
VAL_FILE_LIST_PATH = DATA_DIR+'/val.txt'
# 测试集`file_list`文件路径
TEST_FILE_LIST_PATH = DATA_DIR+'/test.txt'
# 数据集类别信息文件路径
LABEL_LIST_PATH = DATA_DIR+'/labels.txt'
# 实验目录，保存输出的模型权重和结果
EXP_DIR =osp.join(EXP_PATH,'gs_exp_2')



# 固定随机种子，尽可能使实验结果可复现

random.seed(SEED)
np.random.seed(SEED)
paddle.seed(SEED)


# 构建数据集

# 定义训练和验证时使用的数据变换（数据增强、预处理等）
train_transforms = T.Compose([
    # 将影像缩放到256x256大小
    T.Resize(target_size=256),
    # 以50%的概率实施随机水平翻转
    T.RandomHorizontalFlip(prob=0.5),
    T.RandomFlipOrRotation(
                probs  = [0.3, 0.3],             # 进行flip增强的概率是0.3，进行rotate增强的概率是0.2，不变的概率是0.5
                probsf = [0.2, 0.2, 0.2, 0.2, 0.2],  # flip增强时，使用水平flip、垂直flip的概率分别是0.3、0.25，水平且垂直flip、对角线flip、反对角线flip概率均为0，不变的概率是0.45
                probsr = [0.33, 0.33, 0.33]),
    # 将数据归一化到[-1,1]
    T.RandomBlur(0.5),
    T.Normalize(
        mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

eval_transforms = T.Compose([
    T.Resize(target_size=256),
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
    num_workers=0,
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

# # 执行模型训练
model.train(
    num_epochs=400,
    train_dataset=train_dataset,
    train_batch_size=32,
    eval_dataset=val_dataset,
    save_interval_epochs=10,
    # 每多少次迭代记录一次日志
    log_interval_steps=100,
    save_dir=EXP_DIR,
    # 初始学习率大小
    learning_rate=0.01,
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
    "测试集上指标：mIoU为{:.2f}，OAcc为{:.2f}，Kappa系数为{:.2f}".format(
        test_result['miou'], 
        test_result['oacc'],
        test_result['kappa'],
    )
)

print("各类IoU分别为："+', '.join('{:.2f}'.format(iou) for iou in test_result['category_iou']))
print("各类Acc分别为："+', '.join('{:.2f}'.format(acc) for acc in test_result['category_acc']))
print("各类F1分别为："+', '.join('{:.2f}'.format(f1) for f1 in test_result['category_F1-score']))


# 预测结果可视化
# 重复运行本单元可以查看不同结果

def show_images_in_row(ims, fig, title='', lut=None):
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
            im = cv2.imread(im, cv2.IMREAD_COLOR)
        if lut is not None:
            if im.ndim == 3:
                im = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            im = lut[im]
        else:
            im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
        ax.imshow(im)


def get_lut():
    lut = np.zeros((256,3), dtype=np.uint8)
    lut[0] = [255, 0, 0]
    lut[1] = [30, 255, 142]
    lut[2] = [60, 0, 255]
    lut[3] = [255, 222, 0]
    lut[4] = [0, 0, 0]
    return lut


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
        input, mask = test_dataset[idx]
        input = paddle.to_tensor(input).unsqueeze(0)
        print(input.shape)
        logits, *_ = model.net(input)
        pred = paddle.argmax(logits[0], axis=0)
        pred = pred.numpy().astype(np.uint8)
        pred[mask[0]==255] = len(test_dataset.labels)
        preds.append(pred)
show_images_in_row(preds, subfigs[1], title='Pred', lut=get_lut())

# 读取真值标签并显示
im_paths = [test_dataset.file_list[idx]['mask'] for idx in chosen_indices]
show_images_in_row(im_paths, subfigs[2], title='GT', lut=get_lut())

# 渲染结果
fig.canvas.draw()
Image.frombytes('RGB', fig.canvas.get_width_height(), fig.canvas.tostring_rgb())

plt.savefig('fig_gs.png')

