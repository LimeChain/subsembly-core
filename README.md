<p align="center">
  <img src="./images/logo.svg">
</p>

<div align="center">

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) ![Unit Tests](https://github.com/LimeChain/subsembly-core/workflows/Unit%20Tests/badge.svg)

</div>

This is the core library of [Subsembly framework](https://github.com/LimeChain/subsembly) used for developing Substrate runtimes in AssemblyScript.

## Usage

Install the package:
``` 
yarn add subsembly-core 
```  
or  
``` 
npm install subsembly-core
```  

## Folder Structure
Subsembly-Core project consists of following folders:
```
subsembly
    assembly/
    │
    └───models     <--- Models representing common Subsembly types
    |
    └───modules    <--- Core modules used in Runtime development
    │
    └───utils      <--- Utility functions used in Runtime development

```

## Models

Folder consists of commonly used types in Subsembly, such as, `Header`, `Extrinsic`, `Block`, etc. All the models implement Codec interface from [`as-scale-codec`](https://github.com/limechain/as-scale-codec) and have corresponding SCALE encoding and decoding methods.

## Modules

Folder consists of commonly used modules inside Subsembly runtime. For instance, `Log` class to display messages to the Host.

## Utils

Folder consists of commonly used utility functions in Subsembly. For instance, it includes methods for serialising and deserialising data incoming from the Host.

## Funding 

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./images/web3_badge_black.png)