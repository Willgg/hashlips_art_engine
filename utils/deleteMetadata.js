// script to remove file (unpinning) from IPFS
require('dotenv').config()

if (process.argv.length === 3) {
    const axios = require('axios');
    
    console.log(process.env.PINATA_JWT);
    const config = {
        method: 'delete',
        url: `https://api.pinata.cloud/pinning/unpin/${process.argv[2]}`,
        headers: { 
            'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
    };
    axios(config)
      .then((res)=> console.log(res.data))
      .catch((err) => console.log(err.response.data));

} else {
  console.error('Expected CID to be provided!');
  process.exit(1);
}