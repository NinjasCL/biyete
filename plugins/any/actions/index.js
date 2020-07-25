import HttpAction from './http';
import SpreadSheetAction from './spreadsheet';

// The available actions to execute on each email found
// should return a flat array of actions
export default [SpreadSheetAction, HttpAction];
