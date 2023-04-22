import User from '../models/user.js';
import Web3 from 'web3';
async function decrementCoinsById(userId,coins) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.coins -= coins;
      await user.save();
      return user;
    } catch (err) {
      console.error(err);
    }
  }


  async function updateBalance(userId,balance) {
    try {
      const user = await User.findByIdAndUpdate(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.balance = balance;
      await user.save();
      return user;
    } catch (err) {
      console.error(err);
    }
  }

async function getUserById(id) {
    User
    .findOne({ "_id": id })
    .then(docs => {
        return docs;
    })
    .catch(err => {
        return null;
    });
}

export async function Exchange(req, res) {
    User
    .findOne({ "_id": req.params._id })
    .then(docs => {
        const web3 = new Web3('HTTP://127.0.0.1:7545')
        const address = "0xDf1483eD5A63E7e5E8a3549b55d900Ac064C0248";
        const privateKey = "0xf90b316ab567d41aad58f26f631e1a27a14ba8782ba70af9150296c5ec4cdd4c";
        const receiver = docs.address;
        let coin = req.params.coins;
        if (coin > docs.coins)
        {
            return res.status(401).json({"error" : "check funds"});
        }
        let x = coin/1000;
        const deploy = async () => {
        const gasPrice = await web3.eth.getGasPrice();
        console.log(x)
        const ethBalance = web3.utils.toWei(x.toString(), 'ether');
        const createTransaction = await web3.eth.accounts.signTransaction(
        {
        from: address,
        to: receiver,
        value: ethBalance,
        gas: 21000,
        },
        privateKey
        );
        const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        await decrementCoinsById(docs._id,coin);
        await updateBalance(docs.id,await web3.eth.getBalance(receiver))
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);  
        User
        .findOne({ "_id": docs.id })
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            return null;
        });
    };
        deploy();
        
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}




    export function SendTo(req, res) {
        User
        .findOne({ "_id": req.params._id })
        .then(docs => {
            const web3 = new Web3('HTTP://127.0.0.1:7545')
            const address = docs.address
            const privateKey = docs.privatekey;
            const receiver = req.params.receiver;
            let ammount = req.params.ammount;
            const deploy = async () => {
              const gasPrice = await web3.eth.getGasPrice();
              const ethBalance = web3.utils.toWei(ammount.toString(), 'ether');
              const a = ethBalance - gasPrice * 21000
              const b = await web3.eth.getBalance(address)
              if(a > b)
              {
                return res.status(401).json({"error" : "check funds"}); 
              }
              const createTransaction = await web3.eth.accounts.signTransaction(
                {
                  from: address,
                  to: receiver,
                  value: ethBalance - gasPrice * 21000,
                  gas: 21000,
                },
                privateKey
              );
              const receipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
              await updateBalance(docs.id,await web3.eth.getBalance(address))
              User
              .findOne({ "_id": docs.id })
              .then(docs => {
                  res.status(200).json(docs);
              })
              .catch(err => {
                  return null;
              });
            };    
            deploy();
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }



