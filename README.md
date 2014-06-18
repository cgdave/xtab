xTab jQuery plugin
==================

xTab is a very simple spreadsheet-like table jQuery plugin.

Usage:

```javascript
// Creates a 10 rows and 20 columns table with headers
$("#mydiv").xtab("init", { rows: 10, cols: 20, header: true });
// Get the table value as an 10x20 string array
console.log($("#mydiv").xtab("val"));
```

Look at provided `index.html` for a more detailed example.

License
-------

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License [here](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
