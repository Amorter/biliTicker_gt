# BiliTicker-gt-python
## 极验验证模块的python语言绑定

### 使用方式

1. pip install bili_ticket_gt_python
2. 将[click.exe和slide.exe](https://github.com/Amorter/biliTicker_gt/releases/tag/v0.1.2)放入项目目录下
3. import bili_ticket_gt_python
4. slide = bili_ticket_gt_python.SlidePy()
5. click = bili_ticket_gt_python.ClickPy()
6. 通过slide和click调用相关函数

绑定的函数见py.rs文件
## demo

### 执行测试
```python
import bili_ticket_gt_python
slide = bili_ticket_gt_python.SlidePy()
click = bili_ticket_gt_python.ClickPy()

try:
    #改为注册滑块challenge和gt的url
    validate = slide.test("http://127.0.0.1:5000/pc-geetest/register")
    print(validate)
except Exception as e:
    print("识别失败")
    print(e)

try:
    #改为注册点选challenge和gt的url
    validate = click.test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
    print(validate)
except Exception as e:
    print("识别失败")
    print(e)
```


### 分步调用
```python
import bili_ticket_gt_python
slide = bili_ticket_gt_python.SlidePy()

try:
    (gt, challenge) = slide.register_test("http://127.0.0.1:5000/pc-geetest/register")
    (_, _) = slide.get_c_s(gt, challenge)
    _type = slide.get_type(gt, challenge)
    if _type != "slide":
        raise Exception("验证码类型错误")
    (c, s, args) = slide.get_new_c_s_args(gt, challenge)
    #注意滑块验证码这里要刷新challenge
    challenge = args[0]
    key = slide.calculate_key(args)
    #rt固定即可
    #此函数是使用项目目录下的slide.exe生成w参数，如果文件不存在会报错，你也可以自己接入生成w的逻辑函数
    w = slide.generate_w(key, gt, challenge, str(c), s, "abcdefghijklmnop")
    (msg, validate) = slide.verify(gt, challenge, w)
    print(validate)
except Exception as e:
    print("识别失败")
    print(e)
```

```python
import bili_ticket_gt_python
import time
click = bili_ticket_gt_python.ClickPy()

try:
    (gt, challenge) = click.register_test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
    (_, _) = click.get_c_s(gt, challenge)
    _type = click.get_type(gt, challenge)
    if _type != "click":
        raise Exception("验证码类型错误")
    (c, s, args) = click.get_new_c_s_args(gt, challenge)
    before_calculate_key = time.time()
    key = click.calculate_key(args)
    #rt固定即可
    #此函数是使用项目目录下的click.exe生成w参数，如果文件不存在会报错，你也可以自己接入生成w的逻辑函数
    w = click.generate_w(key, gt, challenge, str(c), s, "abcdefghijklmnop")
    #点选验证码生成w后需要等待2秒提交
    w_use_time = time.time() - before_calculate_key
    print("w生成时间：", w_use_time)
    if w_use_time < 2:
        time.sleep(2 - w_use_time)
    (msg, validate) = click.verify(gt, challenge, w)
    print(validate)
except Exception as e:
    print("识别失败")
    print(e)
```