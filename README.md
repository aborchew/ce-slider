ce-slider
==========================

A minimalist, mobile friendly and customizable Angular.js directive for value and range sliders.

Demo: [aborchew.github.io](http://aborchew.github.io/ce-slider)

---------------

Clone and run locally: 

 * `$ git clone https://github.com/aborchew/angular-slider.git`
 * `$ cd ce-slider`
 * `$ npm install`
 * `$ bower install`
 * `$ grunt serve`

#Directive API

The HTML Markup on the page is as follows:
````HTML
<ce-slider
  ce-data="testData"
  ce-model="lowValue"
  ce-model-max="highValue"
  ce-ticks="true"
  ce-drag-area-class="drag-area"
  ce-label-class="value-label"
  ce-label-max-class="value-label-max"
  ce-drag-handle-class="drag-handle"
  ce-drag-handle-max-class="drag-handle-max"
  ce-tick-container-class="ticks"
  ce-tick-class="tick"
  ce-touching-class="touching"
  ce-touching-class-out-delay="0"
  ce-dragging-class="dragging"
  ce-dragging-class-out-delay="0"
>
</ce-slider>
````

<table>
    <thead>
		<tr>
        	<td><b>attribute</b></td>
        	<td><b>Req'd</b></td>
			<td><b>Summary</b></td>
   		</tr>
	</thead>
	<tbody>
		<tr>
        	<td>ce-data</td>
        	<td>Yes</td>
			<td><i>&lt;Array&gt;</i> The data used to create the slider.</td>
   		</tr>
		<tr>
        	<td>ce-model</td>
        	<td>Yes</td>
			<td><i>&lt;Object | String | Array&gt;</i> A model that exists on the current scope that will be updated as the minimum range slider is updated.</td>
   		</tr>
		<tr>
        	<td>ce-model-max</td>
        	<td>No</td>
			<td><i>&lt;Object | String | Array&gt;</i> A model that exists on the current scope that will be updated as the maximum range slider is updated.</td>
   		</tr>
		<tr>
        	<td>ce-ticks</td>
        	<td>No</td>
			<td><i>&lt;int | *&gt;</i> Either an integer (number of tick marks to render) or any other string to render one tick per element in <code>ce-data</code></td>
   		</tr>
		<tr>
        	<td>ce-touching-class</td>
        	<td>No</td>
			<td><i>&lt;String&gt;</i> Class added to handle element when the handle in question is the current target of a mousedown or touch event</td>
   		</tr>
		<tr>
        	<td>ce-dragging-class</td>
        	<td>No</td>
			<td><i>&lt;String&gt;</i> Class added to handle element when the handle in question is the current target of a mousemove or touchmove event</td>
   		</tr>
	</tbody>
</table>

#To Do

 * ~~Make it mobile friendly~~
 * Write tests
 * Ensure single-slider version works well
 * Test in IE8, Windows Phone
 * Document outstanding attributes
 * Eliminate Duplicates in Array input

#Known Issues

 * ~~Odd jumpiness, specifically on lower value slider after window resize.~~
