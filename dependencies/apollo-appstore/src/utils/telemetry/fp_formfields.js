/*   Copyright (C) 2011,2012,2013,2014 John Kula */

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    All trademarks and service marks contained within this document are
    property of their respective owners.

    Version 2014.07.23

    Updates may be found at: http:\\www.darkwavetech.com

*/

/*jslint browser:true */

/* This function returns the form name and list of visible fields on the form */
/* This is useful to detect when your form is being injected with additional HTML */
//Works in Tor
export default () => {
  return new Promise(resolve => {
    try {
      var i = 0
      var j = 0
      var numOfForms = 0
      var numOfInputs = 0
      var strFormsInPage = ''
      var strFormsInputsData = []
      var strInputsInForm = ''
      strFormsInPage = document.getElementsByTagName('form')
      numOfForms = strFormsInPage.length
      strFormsInputsData.push('url=' + window.location.hostname)
      for (i = 0; i < numOfForms; i = i + 1) {
        strFormsInputsData.push('FORM=' + strFormsInPage[i].name)
        strInputsInForm = strFormsInPage[i].getElementsByTagName('input')
        numOfInputs = strInputsInForm.length
        for (j = 0; j < numOfInputs; j = j + 1) {
          if (strInputsInForm[j].type !== 'hidden') {
            strFormsInputsData.push('Input=' + strInputsInForm[j].name)
          }
        }
      }
      resolve({
        'forms': strFormsInputsData.join('~')
      })
    } catch (err) {
      resolve({
        'forms': ''
      })
    }
  })
}
