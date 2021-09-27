import axios from 'axios';
import fs from 'fs';

const sleep = (t) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

const getData = async () => {
  try {
    const response = await axios.get('https://v1.hitokoto.cn', {
      params: {
        encode: 'json',
      },
    });
    console.log('👍已获取数据！');
    return await response.data;
  } catch (e) {
    console.log('🙀访问拒绝，等待中...');
    await sleep(1000);
    console.log('🐱重新获取数据...');
    return {};
  }
};

async function* generateSequence(end) {
  for (let i = 1; i <= end; i++) {
    let response = {};
    while (JSON.stringify(response) === '{}') {
      response = await getData();
    }
    await sleep(200);
    yield response;
  }
}

(async () => {
  const count = 100;
  let data = [];
  let generator = generateSequence(count);
  for await (let response of generator) data.push(response);
  fs.writeFile('data.json', JSON.stringify(data), () => {});
  console.log(`🎉好耶！已获取${count}条hitokoto语句！`);
})();
