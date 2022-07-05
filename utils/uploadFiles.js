// Script to upload images and update metadata files in /build/json/file.json to IPFS

const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const basePath = process.cwd();
const data = new FormData();

fs.readdirSync(`${basePath}/build/images`).forEach(file => {
  const formData = new FormData();
  const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
  formData.append('file', fileStream);
  formData.append('pinataOptions', '{"cidVersion": 1}');
  formData.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Dartagnan"}}');
  const config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    headers: { 
      'Authorization': `Bearer ${process.env.PINATA_JWT}`, 
      ...data.getHeaders()
    },
    data : formData
  };

  axios(config)
    .then((res) => {
      const cid = res.data.IpfsHash;
      const fileName = path.parse(file).name;
      let rawdata = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
      let metaData = JSON.parse(rawdata);
      metaData.image = `ipfs://${cid}`;
      fs.writeFileSync(
        `${basePath}/build/json/${fileName}.json`, 
        JSON.stringify(metaData, null, 2)
      );
      console.log(`file ${fileName} uploaded and ${fileName}.json updated with "${cid}" as image attribute!`);
    })
    .catch((err) => console.error('error: ' + err));
})