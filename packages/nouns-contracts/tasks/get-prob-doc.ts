import { task } from 'hardhat/config'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

task("get-prob-doc", "Get probability config")
    .setAction(async (_, { ethers }) => {
        let probDoc;
        try {
            probDoc = yaml.load(fs.readFileSync(path.join(__dirname, '../config/probability.yaml'), 'utf-8'))
        } catch(error) {
            console.log(error)
        }
        return probDoc
    })