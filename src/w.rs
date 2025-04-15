use std::collections::HashSet;
use rand::{random, thread_rng, Rng};
use rsa::{BigUint, RsaPublicKey, Pkcs1v15Encrypt};
use rand::rngs::OsRng;
use serde_json::{json};
use soft_aes::aes::aes_enc_cbc;
use md5;

const RSA_N: &str = "00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81";
const RSA_E: &str = "010001";
const AES_KEY: &str = "1234567890123456";
const AES_IV: [u8; 16] = [48u8; 16];


const BASE64_TABLE: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()";
const MASK1: i32 = 7274496;
const MASK2: i32 = 9483264;
const MASK3: i32 = 19220;
const MASK4: i32 = 235;

#[inline(always)]
fn choose_bit(base: i32, bit: i32) -> i32 {
    (base >> bit) & 1
}

#[inline(always)]
fn get_int_by_mask(base: i32, mask: i32) -> i32 {
    let mut res = 0;
    for bit in (0..24).rev() {
        if choose_bit(mask, bit) == 1 {
            res = (res << 1) | choose_bit(base, bit)
        }
    }
    res
}

pub fn base64(input: &[u8]) -> String {
    let input = input.iter().map(|x| *x as i32).collect::<Vec<i32>>();
    let mut result: String = String::new();
    let mut padding = "";
    let len = input.len();
    let mut ptr = 0;
    while ptr < len {
        if ptr + 2 < len {
            let c: i32 = (input[ptr] << 16) + (input[ptr + 1] << 8) + input[ptr + 2];
            result = format!(
                "{}{}{}{}{}",
                result,
                BASE64_TABLE[get_int_by_mask(c, MASK1) as usize] as char,
                BASE64_TABLE[get_int_by_mask(c, MASK2) as usize] as char,
                BASE64_TABLE[get_int_by_mask(c, MASK3) as usize] as char,
                BASE64_TABLE[get_int_by_mask(c, MASK4) as usize] as char
            );
        } else {
            let u = len % 3;
            if u == 2 {
                let c: i32 = (input[ptr] << 16) + (input[ptr + 1] << 8);
                result = format!(
                    "{}{}{}{}",
                    result,
                    BASE64_TABLE[get_int_by_mask(c, MASK1) as usize] as char,
                    BASE64_TABLE[get_int_by_mask(c, MASK2) as usize] as char,
                    BASE64_TABLE[get_int_by_mask(c, MASK3) as usize] as char,
                );
                padding = "."
            } else if u == 1 {
                let c: i32 = input[ptr] << 16;
                result = format!(
                    "{}{}{}",
                    result,
                    BASE64_TABLE[get_int_by_mask(c, MASK1) as usize] as char,
                    BASE64_TABLE[get_int_by_mask(c, MASK2) as usize] as char,
                );
                padding = ".."
            }
        }
        ptr += 3
    }
    format!("{}{}", result, padding)
}

fn rsa_encrypt(data: &str) -> String {
    let n_bytes = hex::decode(RSA_N).expect("Invalid hex for modulus (n)");
    let e_bytes = hex::decode(RSA_E).expect("Invalid hex for exponent (e)");

    let n = BigUint::from_bytes_be(&n_bytes);
    let e = BigUint::from_bytes_be(&e_bytes);

    // 构建 RSA 公钥
    let pub_key = RsaPublicKey::new(n, e).expect("Invalid RSA public key");

    // 使用 PKCS#1 v1.5 填充进行加密
    let padding = Pkcs1v15Encrypt;
    let mut rng = OsRng;
    let encrypted_data = pub_key
        .encrypt(&mut rng, padding, data.as_bytes())
        .expect("Encryption failed");

    // 转换为十六进制字符串
    hex::encode(encrypted_data)
}

fn aes_encrypt(data: &str) -> Vec<u8> {
    let encrypted = aes_enc_cbc(data.as_bytes(), AES_KEY.as_bytes(), &AES_IV, Some("PKCS7")).unwrap();
    encrypted
}

fn encrypt(json_str: &str) -> String{
    let u = rsa_encrypt(AES_KEY);
    let h = aes_encrypt(json_str);
    let p = base64(h.as_ref());
    format!("{}{}", p, u)
}

pub(crate) fn click_calculate(key: &str, gt: &str, challenge: &str) -> String {
    let pass_time = (random::<f32>() * 700f32 + 1300f32) as usize;
    let m5 = md5::compute(format!("{}{}{}", gt, &challenge[..challenge.len()-2].to_string(), pass_time));
    let rp = hex::encode(m5.to_vec());

    let dic = json!({
        "lang": "zh-cn",
        "passtime": pass_time,
        "a": key,
        "tt": "",
        "ep": {
            "v": "9.1.8-bfget5",
            "$_E_": false,
            "me": true,
            "ven": "Google Inc. (Intel)",
            "ren": "ANGLE (Intel, Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0, D3D11)",
            "fp": ["move", 483, 149, 1702019849214u64, "pointermove"],
            "lp": ["up", 657, 100, 1702019852230u64, "pointerup"],
            "em": {
                "ph": 0,
                "cp": 0,
                "ek": "11",
                "wd": 1,
                "nt": 0,
                "si": 0,
                "sc": 0,
            },
            "tm": {
                "a": 1702019845759u64,
                "b": 1702019845951u64,
                "c": 1702019845951u64,
                "d": 0,
                "e": 0,
                "f": 1702019845763u64,
                "g": 1702019845785u64,
                "h": 1702019845785u64,
                "i": 1702019845785u64,
                "j": 1702019845845u64,
                "k": 1702019845812u64,
                "l": 1702019845845u64,
                "m": 1702019845942u64,
                "n": 1702019845946u64,
                "o": 1702019845954u64,
                "p": 1702019846282u64,
                "q": 1702019846282u64,
                "r": 1702019846287u64,
                "s": 1702019846288u64,
                "t": 1702019846288u64,
                "u": 1702019846288u64,
            },
            "dnf": "dnf",
            "by": 0,
        },
        "h9s9": "1816378497",
        "rp": rp,
    });

    encrypt(dic.to_string().as_str())
}

fn get_slide_track(distance: i32) -> Vec<Vec<i32>> {
    if distance < 0 {
        panic!("distance必须大于等于0");
    }

    let mut slide_track = Vec::new();
    let mut rng = thread_rng();

    // 初始化轨迹列表
    let x1 = rng.gen_range(-50..=-10); // 生成-50到-10之间的整数
    let y1 = rng.gen_range(-50..=-10);
    slide_track.push(vec![x1, y1, 0]);
    slide_track.push(vec![0, 0, 0]);

    // 计算记录次数
    let count = 30 + (distance / 2);

    // 初始化滑动时间
    let mut t = rng.gen_range(50..=100);

    // 记录上一次滑动的距离
    let mut _x = 0;
    let mut _y = 0;

    for i in 0..count {
        let sep = i as f64 / count as f64;
        let x = if sep == 1.0 {
            distance as f64
        } else {
            (1f64 - 2f64.powf(-10.0 * sep)) * distance as f64
        };
        let x_rounded = x.round() as i32;

        // 增加时间
        t += rng.gen_range(10..=20);

        if x_rounded == _x {
            continue;
        }

        slide_track.push(vec![x_rounded, _y, t]);
        _x = x_rounded;
    }

    // 添加最后一个点
    if let Some(last) = slide_track.last() {
        slide_track.push(last.clone());
    }

    slide_track
}

fn track_encrypt(track: &Vec<Vec<i32>>) -> String {
    // 轨迹处理函数
    fn process_track(track: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut result = Vec::new();
        let mut o = 0;
        let mut e;
        let mut n;
        let mut r;

        for s in 0..track.len() - 1 {
            e = track[s + 1][0] - track[s][0];
            n = track[s + 1][1] - track[s][1];
            r = track[s + 1][2] - track[s][2];

            if e == 0 && n == 0 && r == 0 {
                continue;
            }

            if e == 0 && n == 0 {
                o += r;
            } else {
                result.push(vec![e, n, r + o]);
                o = 0;
            }
        }

        if o != 0 {
            if let Some(last) = result.last() {
                let last_e = last[0];
                let last_n = last[1];
                result.push(vec![last_e, last_n, o]);
            }
        }

        result
    }

    // 数值编码函数
    fn encode_value(t: i32) -> String {
        let e = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr";
        let n = e.len() as i32;
        let mut r = String::new();

        let i = t.abs() as usize;
        let o_val = i as i32 / n;
        let mut o = if o_val >= n { n - 1 } else { o_val } as usize;

        if o >= e.len() {
            o = e.len() - 1;
        }

        if o > 0 {
            r.push(e.chars().nth(o).unwrap());
        }

        let mut s = String::new();
        if t < 0 {
            s.push('!');
        }
        if !r.is_empty() {
            s.push('$');
        }

        s + &r + &e.chars().nth(i % n as usize).unwrap().to_string()
    }

    // 特殊模式编码
    fn encode_pair(t: &[i32]) -> Option<char> {
        let pairs = [
            [1, 0], [2, 0], [1, -1], [1, 1], [0, 1],
            [0, -1], [3, 0], [2, -1], [2, 1]
        ];
        let chars = "stuvwxyz~";

        pairs.iter().enumerate()
            .find(|(_, pair)| t[0] == pair[0] && t[1] == pair[1])
            .map(|(i, _)| chars.chars().nth(i).unwrap())
    }

    // 元素处理函数
    fn process_element(item: &Vec<i32>, r: &mut String, i: &mut String, o: &mut String) {
        if let Some(c) = encode_pair(&item[0..2]) {
            i.push(c);
        } else {
            r.push_str(&encode_value(item[0]));
            i.push_str(&encode_value(item[1]));
        }
        o.push_str(&encode_value(item[2]));
    }

    // 主逻辑
    let t = process_track(track);
    let mut r = String::new();
    let mut i = String::new();
    let mut o = String::new();

    for item in &t {
        process_element(item, &mut r, &mut i, &mut o);
    }

    format!("{}!!{}!!{}", r, i, o)
}

fn final_encrypt(t: String, e: &[u8], n: String) -> String {
    if e.len() < 5 || n.is_empty() {
        return t;
    }

    let s = e[0];
    let a = e[2];
    let m = e[4];

    let original_len = t.len(); // 固定使用原始长度
    let mut i = 0;
    let mut o = t.clone();

    while i <= n.len() - 2 {
        let r = &n[i..i + 2];
        i += 2;

        let c = u8::from_str_radix(r, 16).unwrap();
        let u = char::from(c);

        // 基于原始长度计算插入位置
        let ll = (s as u64 * c as u64 * c as u64 + a as u64 * c as u64 + m as u64) % original_len as u64;
        let ll = ll as usize;

        o.insert(ll, u);
    }

    o
}

fn user_response(key: i32, challenge: &str) -> String {
    // 处理最后两个字符
    let chars_e: Vec<char> = challenge.chars().collect();
    assert!(chars_e.len() >= 2, "输入字符串 e 必须至少包含两个字符");
    let n_chars = &chars_e[chars_e.len() - 2..];

    // 计算 r 数组
    let r: Vec<i32> = n_chars
        .iter()
        .map(|&c| {
            let code = c as i32;
            if code > 57 { code - 87 } else { code - 48 }
        })
        .collect();
    let n = 36 * r[0] + r[1];

    // 计算初始值 a
    let a = key + n;

    // 初始化数据结构
    let mut underscores = vec![vec![]; 5]; // 五元组数组
    let mut char_set = HashSet::new();     // 字符去重集合
    let mut idx = 0;                       // 轮询下标

    // 处理主字符串（去掉最后两个字符）
    let processed_e: String = chars_e[..chars_e.len() - 2].iter().collect();

    // 填充五元组数组
    for c in processed_e.chars() {
        if !char_set.contains(&c) {
            char_set.insert(c);
            underscores[idx].push(c);
            idx = (idx + 1) % 5; // 环形轮询
        }
    }

    // 生成最终字符串
    let mut f = a;
    let mut d = 4; // 从最大值开始处理
    let mut result = String::new();
    let mut weights = vec![1, 2, 5, 10, 50]; // 权重数组

    while f > 0 {
        // 处理下标越界情况（理论上不会出现）
        if d >= weights.len() {
            panic!("权重数组越界，请检查输入参数有效性");
        }

        if f >= weights[d] {
            // 安全访问第一个元素
            if let Some(&char) = underscores[d].get(0) {
                result.push(char);
                f -= weights[d];
            } else {
                panic!("五元组数组 {} 号位置无可用字符，请确保输入字符串包含足够多的唯一字符", d);
            }
        } else {
            // 移除当前权重并下移指针
            underscores.remove(d);
            weights.remove(d);
            if d > 0 {
                d -= 1;
            } else {
                panic!("权重数组耗尽，无法继续处理");
            }
        }
    }

    result
}


pub fn slide_calculate(key: i32, gt: &str, challenge: &str, c: &[u8], s: &str) -> String {
    let track = get_slide_track(key);
    let pass_time = track.last().unwrap()[2];
    let aa = {
        let encrypted_track = track_encrypt(&track);
        final_encrypt(encrypted_track, c, s.to_string())
    };

    let user_response = user_response(key, challenge);

    let m5 = md5::compute(format!("{}{}{}", gt, &challenge[..challenge.len() - 2], pass_time));
    let rp = hex::encode(m5.to_vec());

    let dic = json!({
        "lang": "zh-cn",
        "userresponse": user_response,
        "passtime": pass_time,
        "imgload": thread_rng().gen_range(100..=200),
        "aa": aa,
        "ep": {
            "v": "9.1.8-bfget5",
            "$_E_": false,
            "me": true,
            "ven": "Google Inc. (Intel)",
            "ren": "ANGLE (Intel, Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0, D3D11)",
            "fp": ["move", 483, 149, 1702019849214u64, "pointermove"],
            "lp": ["up", 657, 100, 1702019852230u64, "pointerup"],
            "em": {
                "ph": 0,
                "cp": 0,
                "ek": "11",
                "wd": 1,
                "nt": 0,
                "si": 0,
                "sc": 0,
            },
            "tm": {
                "a": 1702019845759u64,
                "b": 1702019845951u64,
                "c": 1702019845951u64,
                "d": 0,
                "e": 0,
                "f": 1702019845763u64,
                "g": 1702019845785u64,
                "h": 1702019845785u64,
                "i": 1702019845785u64,
                "j": 1702019845845u64,
                "k": 1702019845812u64,
                "l": 1702019845845u64,
                "m": 1702019845942u64,
                "n": 1702019845946u64,
                "o": 1702019845954u64,
                "p": 1702019846282u64,
                "q": 1702019846282u64,
                "r": 1702019846287u64,
                "s": 1702019846288u64,
                "t": 1702019846288u64,
                "u": 1702019846288u64,
            },
            "dnf": "dnf",
            "by": 0,
        },
        "rp": rp,
    });
    encrypt(dic.to_string().as_str())
}