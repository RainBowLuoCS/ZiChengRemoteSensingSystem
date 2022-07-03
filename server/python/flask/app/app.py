from flask import Flask, request, jsonify, session
from changedetector import ChangeDetector, GroundSegmentor, ObjectAttainor, ObjectDetector

app = Flask(__name__)

# # 将导出模型所在目录传入Predictor的构造方法中
# gs_model_dir = '/home/luorun/cd2022space/deploy/gs'
# gs_predictor = pdrs.deploy.Predictor(gs_model_dir, use_gpu=True,gpu_id=1)
# gs_predictor.predict(img_file="/home/luorun/wxq/img/test1.jpg", warmup_iters=10)

# cd_model_dir = '/home/luorun/cd2022space/deploy/cd'
# cd_predictor = pdrs.deploy.Predictor(cd_model_dir, use_gpu=True)
# cd_predictor.predict(img_file=[("/home/luorun/wxq/img/cd_test_A_1.png", "/home/luorun/wxq/img/cd_test_B_1.png")], warmup_iters=10)


gs_predictor = GroundSegmentor(gpu_id=1)
cd_predictor = ChangeDetector(gpu_id=1)
oa_predictor = ObjectAttainor(gpu_id=1)
od = ObjectDetector(gpu_id=1)


@app.route("/", methods=["GET"])
def ping():
    return jsonify(msg="success")


# 地物分类接口
@app.route("/gs")
def gs():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + path for path in ps.split(',')]
    label_maps = gs_predictor.predict(img_paths=paths)

    return str(label_maps)


# 变化检测接口
@app.route("/cd")
def cd():
    ps = str(request.args.get("ps"))
    paths = [("/home/luorun/wxq/img/" + path for path in ps.split(','))]
    label_maps = cd_predictor.predict(img_paths=paths)

    return str(label_maps)


# 目标提取接口
@app.route("/oa")
def oa():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + ps]
    print(paths)
    label_maps = oa_predictor.predict(img_paths=paths)
    # label_maps = oa_predictor.predict()

    return str(label_maps)


# 目标检测（飞机）接口
@app.route("/od/aircraft")
def od_aircraft():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + ps]
    bboxs = od.aircraft_predict(img_paths=paths)

    return str(bboxs)

# 目标检测（立交桥目标中心）接口
@app.route("/od/overpass")
def od_overpass():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + ps]
    bboxs = od.overpass_predict(img_paths=paths)

    return str(bboxs)


# 目标检测（油井）接口
@app.route("/od/oiltank")
def od_oiltank():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + ps]
    bboxs = od.oiltank_predict(img_paths=paths)

    return str(bboxs)


# 目标检测（操场）接口
@app.route("/od/playground")
def od_playground():
    ps = str(request.args.get("ps"))
    paths = ["/home/luorun/wxq/img/" + ps]
    bboxs = od.playground_predict(img_paths=paths)

    return str(bboxs)


app.run(host="0.0.0.0", port=8808)
