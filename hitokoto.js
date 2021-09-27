import axios from 'axios';
import fs from 'fs';
const getData = async (data) => {
  const res = await axios.get('https://v1.hitokoto.cn', {
    params: {
      encode: 'json',
    },
  });
  const resData = await res.data;
  return resData;
};

async function* generateSequence(end) {
  for (let i = 1; i <= end; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield i;
  }
}

(async () => {
  let data = [];
  let generator = generateSequence(1);
  for await (let value of generator) {
    const response = await getData(data);
    if (response) data.push(response);
  }
  fs.writeFile('data.json', JSON.stringify(data), () => {});
  console.log('Done!');
})();
