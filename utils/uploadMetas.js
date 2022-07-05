// Script to upload metadata to IPFS 
require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const rfs = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const basePath = process.cwd();

const pinDirectoryToPinata = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const src = `${basePath}/build/json`;
  var status = 0;
  try {
    const { dirs, files } = await rfs.read(src);
    let data = new FormData();

    for (const file of files) {
      if (file == src + '/_metadata.json' || file == src + '/_ipfsMetas.json') {
        continue
      } 
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file),
      });
    }
    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: { 
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          "Authorization": `Bearer ${process.env.PINATA_JWT}`,
          ...data.getHeaders()
        },
        data: data
    };
    axios(config)
      .then((res) => console.log(res))
  } catch (error) {
    console.log(error);
  }
};

pinDirectoryToPinata()
