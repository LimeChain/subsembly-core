# Subsembly-Core
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The project is funded by [Web3 Foundation](https://web3.foundation/) via their [General Grants Program](https://github.com/w3f/General-Grants-Program) 🙏
![WEB3 Badge](./web3_badge_black.png)

This is the core library of Subsembly framework used for developing Substrate runtimes in AssemblyScript. The project is work in progress.

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

Folder consists of commonly used types in Subsembly, such as, `Header`, `Extrinsic`, `Block`, etc. All the models implement Codec interface and have corresponding SCALE encoding and decoding methods. Additionaly, all the models have their own interface.

## Modules

Folder consists of commonly used modules inside Subsembly runtime. For instance, `Log` class to display messages to the Host.

## Utils

Folder consists of commonly used utility functions in Subsembly. For instance, it includes methods for serialising and deserialising data incoming from the Host.

