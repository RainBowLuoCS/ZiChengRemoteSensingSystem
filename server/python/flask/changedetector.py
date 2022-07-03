import paddlers as pdrs
import paddle
import os.path as osp
from tqdm import tqdm
from functools import partial
import cv2
import numpy as np


##################################
# 定义推理阶段使用的数据集

class InferDataset(paddle.io.Dataset):
    """
    变化检测推理数据集。

    Args:
    """

    def __init__(
        self,
        image_files=None
    ):
        super().__init__()

        samples = []
        names = []
        for img1_path,img2_path in image_files:
            item_dict = {
                'image_t1': img1_path,
                'image_t2': img2_path
            }
            samples.append(item_dict)
            names.append(osp.basename(img1_path))

        self.samples = samples
        self.names = names

    def __getitem__(self, idx):
        sample = self.samples[idx]
        return cv2.imread(sample['image_t1']).astype(np.float32), \
               cv2.imread(sample['image_t2']).astype(np.float32)

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
        h, w = ori_size
        win_gen = WindowGenerator(h, w, window_size, window_size, stride, stride)
        all_patches = []
        for rows, cols in win_gen:
            # NOTE: 此处不能使用生成器，否则因为lazy evaluation的缘故会导致结果不是预期的
            patches = [im[:,rows,cols,:] for im in ims]
            all_patches.append(patches)
        yield tuple(map(partial(np.concatenate, axis=0), zip(*all_patches)))

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
# 推理过程主循环
# 推理过程主循环
def quantize(arr):
    return (arr*255).astype('uint8')

class ChangeDetector(object):
    def __init__(self,gpu_id=0,use_trt=False):
        self.predictor=pdrs.deploy.Predictor('/home/luorun/cd2022space/deploy/cd',use_gpu=True,gpu_id=gpu_id,use_trt=use_trt)
    def predict(self,img_paths=[('/home/luorun/cd2022space/Data/cd_data/test/A/test_5.png','/home/luorun/cd2022space/Data/cd_data/test/B/test_5.png')]):
        test_dataset = InferDataset(img_paths)
        # 创建DataLoader
        test_dataloader = paddle.io.DataLoader(
            test_dataset,
            batch_size=1,
            shuffle=False,
            num_workers=0,
            drop_last=False,
            return_list=True
        )
        test_dataloader = crop_patches(
            test_dataloader,
            (1024,1024),
            256,
            64
        )
        len_test = len(test_dataset.names)
        results=[]
        for name, (t1, t2) in tqdm(zip(test_dataset.names, test_dataloader), total=len_test):
            cv2.imwrite('test_1.png', t1[0])
            cv2.imwrite('test_2.png', t2[0])
            temp=self.predictor.predict(img_file=[(i,j) for i,j in zip(t1,t2)])
            pred=np.array([i['label_map'] for i in temp])
            # 由patch重建完整概率图q
            prob = recons_prob_map(pred, (1024,1024), 256, 64)
            # 默认将阈值设置为0.5，即，将变化概率大于0.5的像素点分为变化类
            out = quantize(prob>0.5)
            results.append(out)
        cv2.imwrite('test.png', out)
        return results
class GroundSegmentor(object):
    def __init__(self,gpu_id=0,use_trt=False):
        self.predictor=pdrs.deploy.Predictor('/home/luorun/cd2022space/deploy/gs',use_gpu=True,gpu_id=gpu_id,use_trt=use_trt)
    def predict(self,img_paths=[('/home/luorun/cd2022space/Data/train_and_label/img_train/T000000.jpg')]):
        results=[i['label_map'] for i in self.predictor.predict(img_file=img_paths)]
        return results
class ObjectAttainor(object):
    def __init__(self,gpu_id=0,use_trt=False):
        self.predictor=pdrs.deploy.Predictor('/home/luorun/cd2022space/deploy/oa',use_gpu=True,gpu_id=gpu_id,use_trt=use_trt)
    def predict(self,img_paths=[('/home/luorun/cd2022space/Data/massroad/road_segmentation_ideal/training/input/img-1.png')]):
        results=[i['label_map'] for i in self.predictor.predict(img_file=img_paths)]
        return results

