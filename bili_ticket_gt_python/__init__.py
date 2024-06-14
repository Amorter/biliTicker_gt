from .bili_ticket_gt_python import *
import pythonmonkey as pm
import os

_ROOT = os.path.dirname(__file__)


def click_w(positions: str, gt: str, challenge: str, c: str, s: str, rt: str) -> str:
    """
    点选验证w计算
    """
    click_result = pm.require(_ROOT + "\\js\\click.js")
    dist = click_result(positions, gt, challenge, c, s, rt)
    return dist


def slide_w(dis: str, gt: str, challenge: str, c: str, s: str, rt: str) -> str:
    """
    滑块验证w计算
    """
    slide_result = pm.require(_ROOT + "\\js\\slide.js")
    dist = slide_result(dis, gt, challenge, c, s, rt)
    return dist
