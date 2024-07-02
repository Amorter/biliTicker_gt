fn encode(data: &[u8]) -> String {
    const CHARSET: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()";
    let charset: Vec<char> = CHARSET.chars().collect();

    fn get_char(val: usize, charset: &[char]) -> char {
        if val < charset.len() {
            charset[val]
        } else {
            '.'
        }
    }

    fn extract_bits(value: u32, mask: u32) -> u32 {
        let mut result = 0;
        for shift in (0..24).rev() {
            if (mask & (1 << shift)) != 0 {
                result = (result << 1) | ((value >> shift) & 1);
            }
        }
        result  
    }

    let mut encoded_str = String::new();
    let length = data.len();
    let mut i = 0;

    while i < length {
        if i + 2 < length {
            let combined = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8) | (data[i + 2] as u32);
            encoded_str.push(get_char(extract_bits(combined, 0x6F0000) as usize, &charset));
            encoded_str.push(get_char(extract_bits(combined, 0x090000) as usize, &charset));
            encoded_str.push(get_char(extract_bits(combined, 0x04B0) as usize, &charset));
            encoded_str.push(get_char(extract_bits(combined, 0xEB) as usize, &charset));
        } else {
            let remaining = length - i;
            if remaining == 2 {
                let combined = ((data[i] as u32) << 16) | ((data[i + 1] as u32) << 8);
                encoded_str.push(get_char(extract_bits(combined, 0x6F0000) as usize, &charset));
                encoded_str.push(get_char(extract_bits(combined, 0x090000) as usize, &charset));
                encoded_str.push(get_char(extract_bits(combined, 0x04B0) as usize, &charset));
                encoded_str.push('.');
            } else if remaining == 1 {
                let combined = (data[i] as u32) << 16;
                encoded_str.push(get_char(extract_bits(combined, 0x6F0000) as usize, &charset));
                encoded_str.push(get_char(extract_bits(combined, 0x090000) as usize, &charset));
                encoded_str.push_str("..");
            }
        }
        i += 3;
    }

    encoded_str
}

fn main() {
    let data = b"Hello, World!";
    let encoded = encode(data);
    println!("{}", encoded);
}