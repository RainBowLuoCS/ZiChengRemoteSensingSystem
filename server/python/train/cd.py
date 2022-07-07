# import random
# import os.path as osp
# from glob import glob


# # 随机数生成器种子
# RNG_SEED = 114514
# # 调节此参数控制训练集数据的占比
# TRAIN_RATIO = 0.95
# # 数据集路径
# DATA_DIR = '/home/luorun/cd2022space/Data/cd_data'


# def write_rel_paths(phase, names, out_dir, prefix=''):
#     """将文件相对路径存储在txt格式文件中"""
#     with open(osp.join(out_dir, phase+'.txt'), 'w') as f:
#         for name in names:
#             f.write(
#                 ' '.join([
#                     osp.join(prefix, 'A', name),
#                     osp.join(prefix, 'B', name),
#                     osp.join(prefix, 'label', name)
#                 ])
#             )
#             f.write('\n')


# random.seed(RNG_SEED)

# # 随机划分训练集/验证集
# names = list(map(osp.basename, glob(osp.join(DATA_DIR, 'train', 'label', '*.png'))))
# # 对文件名进行排序，以确保多次运行结果一致
# names.sort()
# # names=names[:638]
# random.shuffle(names)
# len_train = int(len(names)*TRAIN_RATIO) # 向下取整
# write_rel_paths('train', names[:len_train], DATA_DIR, prefix='train')
# write_rel_paths('val', names[len_train:], DATA_DIR, prefix='train')
# write_rel_paths(
#     'test', 
#     map(osp.basename, glob(osp.join(DATA_DIR, 'test', 'A', '*.png'))), 
#     DATA_DIR,
#     prefix='test'
# )

# print("数据集划分已完成。")




# 导入一些需要用到的库

import random
import os
import os.path as osp
from copy import deepcopy
from functools import partial

import numpy as np
import paddle
import paddlers as pdrs
from paddlers import transforms as T
from PIL import Image
from skimage.io import imread, imsave
from tqdm import tqdm

import random
# 定义全局变量
# 可在此处调整实验所用超参数

# 随机种子
SEED = 20220423

# 数据集路径，如果你训要训练该模型，你需要改变模型的路径
DATA_PATH='/home/luorun/cd2022space/Data'
EXP_PATH='/home/luorun/cd2022space/exp'

DATA_DIR = os.path.join(DATA_PATH,'cd_data')
# 实验路径。实验目录下保存输出的模型权重和结果
EXP_DIR = os.path.join(EXP_PATH,'cd_exp')
# 保存最佳模型的路径
BEST_CKP_PATH = osp.join(EXP_DIR, 'best_model', 'model.pdparams')

# 训练的epoch数
# NUM_EPOCHS =4000
NUM_EPOCHS =1000
# 每多少个epoch保存一次模型权重参数
SAVE_INTERVAL_EPOCHS = 10
# 初始学习率
LR = 0.001
# 学习率衰减步长（注意，单位为迭代次数而非epoch数），即每多少次迭代将学习率衰减一半
# DECAY_STEP = 3810
DECAY_STEP = 3500
# 训练阶段 batch size
TRAIN_BATCH_SIZE = 16
# 推理阶段 batch size 
INFER_BATCH_SIZE = 4
# 加载数据所使用的进程数
NUM_WORKERS = 4
# 裁块大小
CROP_SIZES = [256]
# 模型推理阶段使用的滑窗步长
STRIDES = [64]
PROBS=[0.5]
# 影像原始大小
ORIGINAL_SIZE = (1024, 1024)

STD=[0.5,0.5,0.5]
MEAN=[0.5,0.5,0.5]
paddle.device.set_device('gpu:1')

# 固定随机种子，尽可能使实验结果可复现

random.seed(SEED)
np.random.seed(SEED)
paddle.seed(SEED)



def info(msg, **kwargs):
    print(msg, **kwargs)


def warn(msg, **kwargs):
    print('\033[0;31m'+msg, **kwargs)


def quantize(arr):
    return (arr*255).astype('uint8')



# 调用PaddleRS API一键构建模型
model = pdrs.tasks.BIT(
    # 模型输出类别数
    num_classes=2,
    # 是否使用混合损失函数，默认使用交叉熵损失函数训练
    use_mixed_loss=True,
    # 模型输入通道数
    in_channels=3,
    # 模型使用的骨干网络，支持'resnet18'或'resnet34'
    backbone='resnet34',
    # 骨干网络中的resnet stage数量
    n_stages=4,
    # 是否使用tokenizer获取语义token
    use_tokenizer=True,
    # token的长度
    token_len=24,
    # 若不使用tokenizer，则使用池化方式获取token。此参数设置池化模式，有'max'和'avg'两种选项，分别对应最大池化与平均池化
    pool_mode='max',
    # 池化操作输出特征图的宽和高（池化方式得到的token的长度为pool_size的平方）
    pool_size=2,
    # 是否在Transformer编码器中加入位置编码（positional embedding）
    enc_with_pos=True,
    # Transformer编码器使用的注意力模块（attention block）个数
    enc_depth=3,
    # Transformer编码器中每个注意力头的嵌入维度（embedding dimension）
    enc_head_dim=64,
    # Transformer解码器使用的注意力模块个数
    dec_depth=8,
    # Transformer解码器中每个注意力头的嵌入维度
    dec_head_dim=24
)

# 构建需要使用的数据变换（数据增强、预处理）
# 使用Compose组合多种变换方式。Compose中包含的变换将按顺序串行执行
train_transforms = T.Compose([
    # 随机裁剪
    T.RandomCrop(
        # 裁剪区域将被缩放到此大小
        crop_size=CROP_SIZES[0],
        # 将裁剪区域的横纵比固定为1
        aspect_ratio=[1.0, 1.0],
        # 裁剪区域相对原始影像长宽比例在一定范围内变动，最小不低于原始长宽的1/5
        scaling=[0.2, 1.0]
    ),
    # 以50%的概率实施随机水平翻转
    T.RandomHorizontalFlip(prob=0.5),
    # 以50%的概率实施随机垂直翻转
    T.RandomVerticalFlip(prob=0.5),
    T.RandomFlipOrRotation(
    probs  = [0.2, 0.5],
    probsf = [0, 0, 0, 0.5, 0.5],
    probsr = [0.35, 0.3, 0.35]),
    # 数据归一化到[-1,1],
    T.RandomBlur(prob=0.2),
    # T.RandomDistort(brightness_range=0.1),
    T.Normalize(
        mean=MEAN,
        std=STD
    )
])
eval_transforms = T.Compose([
    # 在验证阶段，输入原始尺寸影像，对输入影像仅进行归一化处理
    # 验证阶段与训练阶段的数据归一化方式必须相同
    T.Normalize(
        mean=MEAN,
        std=STD
    )
])

# 实例化数据集
train_dataset = pdrs.datasets.CDDataset(
    data_dir=DATA_DIR,
    file_list=osp.join(DATA_DIR, 'train.txt'),
    label_list=None,
    transforms=train_transforms,
    num_workers=NUM_WORKERS,
    shuffle=True,
    binarize_labels=True
)

eval_dataset = pdrs.datasets.CDDataset(
    data_dir=DATA_DIR,
    file_list=osp.join(DATA_DIR, 'val.txt'),
    label_list=None,
    transforms=eval_transforms,
    num_workers=0,
    shuffle=False,
    binarize_labels=True
)

# 若实验目录不存在，则新建之（递归创建目录）
if not osp.exists(EXP_DIR):
    os.makedirs(EXP_DIR)


# 构建学习率调度器和优化器

# 制定定步长学习率衰减策略
lr_scheduler = paddle.optimizer.lr.StepDecay(
    LR,
    step_size=DECAY_STEP,
    # 学习率衰减系数，这里指定每次减半
    gamma=0.5
)
# 构造Adam优化器
optimizer = paddle.optimizer.Adam(
    learning_rate=lr_scheduler,
    parameters=model.net.parameters()
)

# # 调用PaddleRS API实现一键训练
# model.train(
#     num_epochs=NUM_EPOCHS,
#     train_dataset=train_dataset,
#     train_batch_size=TRAIN_BATCH_SIZE,
#     eval_dataset=eval_dataset,
#     optimizer=optimizer,
#     save_interval_epochs=SAVE_INTERVAL_EPOCHS,
#     # 每多少次迭代记录一次日志
#     log_interval_steps=10,  
#     save_dir=EXP_DIR,
#     # 是否使用early stopping策略，当精度不再改善时提前终止训练
#     early_stop=False,
#     # 是否启用VisualDL日志功能
#     use_vdl=True,
#     # 指定从某个检查点继续训练
#     resume_checkpoint=None
# )


# 定义推理阶段使用的数据集

class InferDataset(paddle.io.Dataset):
    """
    变化检测推理数据集。

    Args:
        data_dir (str): 数据集所在的目录路径。
        transforms (paddlers.transforms.Compose): 需要执行的数据变换操作。
    """

    def __init__(
        self,
        data_dir,
        transforms
    ):
        super().__init__()

        self.data_dir = data_dir
        self.transforms = deepcopy(transforms)

        pdrs.transforms.arrange_transforms(
            model_type='changedetector',
            transforms=self.transforms,
            mode='test'
        )

        with open(osp.join(data_dir, 'test.txt'), 'r') as f:
            lines = f.read()
            lines = lines.strip().split('\n')

        samples = []
        names = []
        for line in lines:
            items = line.strip().split(' ')
            items = list(map(pdrs.utils.path_normalization, items))
            item_dict = {
                'image_t1': osp.join(data_dir, items[0]),
                'image_t2': osp.join(data_dir, items[1])
            }
            samples.append(item_dict)
            names.append(osp.basename(items[0]))

        self.samples = samples
        self.names = names

    def __getitem__(self, idx):
        sample = deepcopy(self.samples[idx])
        output = self.transforms(sample)
        return paddle.to_tensor(output[0]), \
               paddle.to_tensor(output[1])

    def __len__(self):
        return len(self.samples)



# 考虑到原始影像尺寸较大，以下类和函数与影像裁块-拼接有关。

class WindowGenerator:
    def __init__(self, h, w, ch, cw, si=1, sj=1):
        self.h = h
        self.w = w
        self.ch = ch
        self.cw = cw
        if self.h < self.ch or self.w < self.cw:
            raise NotImplementedError
        self.si = si
        self.sj = sj
        self._i, self._j = 0, 0

    def __next__(self):
        # 列优先移动（C-order）
        if self._i > self.h:
            raise StopIteration
        
        bottom = min(self._i+self.ch, self.h)
        right = min(self._j+self.cw, self.w)
        top = max(0, bottom-self.ch)
        left = max(0, right-self.cw)

        if self._j >= self.w-self.cw:
            if self._i >= self.h-self.ch:
                # 设置一个非法值，使得迭代可以early stop
                self._i = self.h+1
            self._goto_next_row()
        else:
            self._j += self.sj
            if self._j > self.w:
                self._goto_next_row()

        return slice(top, bottom, 1), slice(left, right, 1)

    def __iter__(self):
        return self

    def _goto_next_row(self):
        self._i += self.si
        self._j = 0

def crop_patches(dataloader, ori_size, window_size, stride):
    """
    将`dataloader`中的数据裁块。

    Args:
        dataloader (paddle.io.DataLoader): 可迭代对象，能够产生原始样本（每个样本中包含任意数量影像）。
        ori_size (tuple): 原始影像的长和宽，表示为二元组形式(h,w)。
        window_size (int): 裁块大小。
        stride (int): 裁块使用的滑窗每次在水平或垂直方向上移动的像素数。

    Returns:
        一个生成器，能够产生iter(`dataloader`)中每一项的裁块结果。一幅图像产生的块在batch维度拼接。例如，当`ori_size`为1024，而
            `window_size`和`stride`均为512时，`crop_patches`返回的每一项的batch_size都将是iter(`dataloader`)中对应项的4倍。
    """

    for ims in dataloader:
        ims = list(ims)
        h, w = ori_size
        win_gen = WindowGenerator(h, w, window_size, window_size, stride, stride)
        all_patches = []
        for rows, cols in win_gen:
            # NOTE: 此处不能使用生成器，否则因为lazy evaluation的缘故会导致结果不是预期的
            patches = [im[...,rows,cols] for im in ims]
            all_patches.append(patches)
        yield tuple(map(partial(paddle.concat, axis=0), zip(*all_patches)))

def recons_prob_map(patches, ori_size, window_size, stride):
    """从裁块结果重建原始尺寸影像，与`crop_patches`相对应"""
    # NOTE: 目前只能处理batch size为1的情况
    h, w = ori_size
    win_gen = WindowGenerator(h, w, window_size, window_size, stride, stride)
    prob_map = np.zeros((h,w), dtype=np.float)
    cnt = np.zeros((h,w), dtype=np.float)
    # XXX: 需要保证win_gen与patches具有相同长度。此处未做检查
    for (rows, cols), patch in zip(win_gen, patches):
        prob_map[rows, cols] += patch
        cnt[rows, cols] += 1
    prob_map /= cnt
    return prob_map

# 若输出目录不存在，则新建之（递归创建目录）
out_dir = osp.join(EXP_DIR, 'submission')
if not osp.exists(out_dir):
    os.makedirs(out_dir)
# out_256=osp.join('/home/uu201915762/workspace/expspace/cd_exp_256', 'submission')

# 为模型加载历史最佳权重
state_dict = paddle.load(BEST_CKP_PATH)
# 同样通过net属性访问组网对象
model.net.set_state_dict(state_dict)

# 实例化测试集
test_dataset = InferDataset(
    DATA_DIR,
    # 注意，测试阶段使用的归一化方式需与训练时相同
    T.Compose([
        T.Normalize(
            mean=MEAN,
            std=STD
        )
    ])
)

# 创建DataLoader
test_dataloader = paddle.io.DataLoader(
    test_dataset,
    batch_size=1,
    shuffle=False,
    num_workers=0,
    drop_last=False,
    return_list=True
)
test_dataloaders=[crop_patches(
    test_dataloader,
    ORIGINAL_SIZE,
    crop_size,
    stride
) for crop_size,stride in zip(CROP_SIZES,STRIDES)]



# 推理过程主循环
info("模型推理开始")

model.net.eval()
len_test = len(test_dataset.names)

with paddle.no_grad():
    for idx,data in tqdm(enumerate(zip(*test_dataloaders)), total=len_test):
        name=test_dataset.names[idx]
        outs=[]
        for j,(t1,t2) in enumerate(data):
            shape = paddle.shape(t1)
            pred = paddle.zeros(shape=(shape[0],2,*shape[2:]))
            for i in range(0, shape[0], INFER_BATCH_SIZE):
                pred[i:i+INFER_BATCH_SIZE] = model.net(t1[i:i+INFER_BATCH_SIZE], t2[i:i+INFER_BATCH_SIZE])[0]
            # 取softmax结果的第1（从0开始计数）个通道的输出作为变化概率
            prob = paddle.nn.functional.softmax(pred, axis=1)[:,1]
            # 由patch重建完整概率图
            prob = recons_prob_map(prob.numpy(), ORIGINAL_SIZE, CROP_SIZES[j], STRIDES[j]) 
            outs.append(quantize(prob>PROBS[j]))
        out=quantize((sum(outs)/len(PROBS))>0.1)
        # in_256=imread(osp.join(out_256, name))
        # out=quantize(np.logical_or(out,in_256))
        # 默认将阈值设置为0.5，即，将变化概率大于0.5的像素点分为变化类
        imsave(osp.join(out_dir, name), out, check_contrast=False)

info("模型推理完成")
