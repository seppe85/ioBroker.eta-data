![Logo](admin/eta-data.png)
# ioBroker.eta-data

[![NPM version](http://img.shields.io/npm/v/iobroker.eta-data.svg)](https://www.npmjs.com/package/iobroker.eta-data)
[![Downloads](https://img.shields.io/npm/dm/iobroker.eta-data.svg)](https://www.npmjs.com/package/iobroker.eta-data)
![Number of Installations (latest)](http://iobroker.live/badges/eta-data-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/eta-data-stable.svg)
[![Dependency Status](https://img.shields.io/david/seppe85/iobroker.eta-data.svg)](https://david-dm.org/seppe85/iobroker.eta-data)
[![Known Vulnerabilities](https://snyk.io/test/github/seppe85/ioBroker.eta-data/badge.svg)](https://snyk.io/test/github/seppe85/ioBroker.eta-data)

[![NPM](https://nodei.co/npm/iobroker.eta-data.png?downloads=true)](https://nodei.co/npm/iobroker.eta-data/)

**Tests:** ![Test and Release](https://github.com/seppe85/ioBroker.eta-data/workflows/Test%20and%20Release/badge.svg)

## eta-data adapter for ioBroker

This adapter reads information from an ETA touch boiler.
I am using a PU15 pellet boiler.
Currently only values are retrieved for static uris (variables).
To read the variable values a variable set is created which bundles all relevant variables.
With that values of all relevant variables can be fetched via one single request.  

## Developer manual
This section is intended for the developer. It can be deleted later

## Changelog

### 0.0.1
* (seppix85) initial release

### 0.0.2
* (seppix85) fixed invalid number values (temperatures with digits)

## License
MIT License

Copyright (c) 2021 seppix85 <seppix@freenet.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.