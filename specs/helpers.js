'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
chai.use(dirtyChai);

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
