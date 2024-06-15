from typing import Tuple
class SlidePy:
    """
    滑块验证码封装类
    """
    def __init__(self) -> None:
        """
        初始化，请不要在循环中调用
        否则会降低程序运行速度
        """

    def register_test(self, url: str) -> Tuple[str, str]:
        """
        注册验证码
        :param url: 注册验证码challenge和gt的url
        :return: gt, challenge
        """

    def get_c_s(self, gt: str, challenge: str, w: str = None) -> Tuple[list, str]:
        """
        获取c_s
        :param gt: gt
        :param challenge: challenge
        :param w: w可为空
        :return: c, s
        """

    def get_type(self, gt: str, challenge: str, w: str = None) -> str:
        """
        获取验证码类型
        :param gt: gt
        :param challenge: challenge
        :param w: w可为空
        :return: type(slide或click)
        """

    def get_new_c_s_args(self, gt: str, challenge: str) -> Tuple[list, str, Tuple[str, str, str, str]]:
        """
        获取新的c_s参数和验证所需参数
        :param gt: gt
        :param challenge: challenge
        :return: c, s, args(new_challenge, 完整背景图url, 缺口背景图url, 滑块图url)
        """

    def calculate_key(self, args: Tuple[str, str, str, str]) -> str:
        """
        计算生成w所需关键参数
        :param args: new_challenge, 完整背景图url, 缺口背景图url, 滑块图url
        :return: key
        """

    def generate_w(self, key: str, gt: str, challenge: str, c: str, s: str, rt: str,) -> str:
        """
        生成w
        :param key: calculate_key生成的关键参数
        :param gt: gt
        :param challenge: challenge
        :param c: c
        :param s: s
        :param rt: rt
        :return: w
        """

    def verify(self, gt: str, challenge: str, w: str) -> Tuple[str, str]:
        """
        验证
        :param gt: gt
        :param challenge: challenge
        :param w: w
        :return: message, validate
        """

    def test(self, url: str) -> str:
        """
        测试
        :param url: 注册验证码challenge和gt的url
        :return validate
        """

class ClickPy:
    """
    滑块验证码封装类
    """
    def __init__(self) -> None:
        """
        初始化，请不要在循环中调用
        否则会降低程序运行速度
        """

    def register_test(self, url: str) -> Tuple[str, str]:
        """
        注册验证码
        :param url: 注册验证码challenge和gt的url
        :return: gt, challenge
        """

    def get_c_s(self, gt: str, challenge: str, w: str = None) -> Tuple[list, str]:
        """
        获取c_s
        :param gt: gt
        :param challenge: challenge
        :param w: w可为空
        :return: c, s
        """

    def get_type(self, gt: str, challenge: str, w: str = None) -> str:
        """
        获取验证码类型
        :param gt: gt
        :param challenge: challenge
        :param w: w可为空
        :return: type(slide或click)
        """

    def get_new_c_s_args(self, gt: str, challenge: str) -> Tuple[list, str, str]:
        """
        获取新的c_s参数和验证所需参数
        :param gt: gt
        :param challenge: challenge
        :return: c, s, args(点选验证码图片url)
        """

    def calculate_key(self, args: str) -> str:
        """
        计算生成w所需关键参数
        :param args: 点选验证码图片url
        :return: key
        """

    def generate_w(self, key: str, gt: str, challenge: str, c: str, s: str, rt: str,) -> str:
        """
        生成w
        :param key: calculate_key生成的关键参数
        :param gt: gt
        :param challenge: challenge
        :param c: c
        :param s: s
        :param rt: rt
        :return: w
        """

    def verify(self, gt: str, challenge: str, w: str) -> Tuple[str, str]:
        """
        验证
        :param gt: gt
        :param challenge: challenge
        :param w: w
        :return: message, validate
        """

    def test(self, url: str) -> str:
        """
        测试
        :param url: 注册验证码challenge和gt的url
        :return validate
        """

    def simple_match(self, gt: str, challenge: str) -> str:
        """
        根据gt和challenge自动验证
        :param gt: gt
        :param challenge: challenge
        :return: validate
        """

    def simple_match_retry(self, gt: str, challenge: str) -> str:
        """
        根据gt和challenge自动验证，如果验证失败则重试
        :param gt: gt
        :param challenge: challenge
        :return: validate
        """