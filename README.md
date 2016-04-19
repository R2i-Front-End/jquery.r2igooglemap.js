# jquery.r2igooglemap.js
This is the home of the R2i Google Map plugin documentation.

R2i Google Map Description
--------------------------------------
This is a plugin to allow make adding a Google Map easier, this is mainly used in the CMS's that R2i works with so that we can have a uniform approach to addressing how we build out Google Maps.  This is considered the base and is expected to be modified to add in customization for each sites specific needs.

What the Google Map Plugin relies on?
--------------------------------------
* jQuery version 1.11 or later
* Google Maps API Key (https://developers.google.com/maps/web/) 

How to Initialize the Plugin
--------------------------------------
```
  jQuery('#map').googleMap({
    mapLocs: [{
      name: 'R2i Baltimore',
      lat: 39.287267,
      lng: -76.609354,
      infoWindow: '<div class="content"><h4>R2i Baltimore</h4><p>R2is headquarters located in the heart of the inner harbor. </p><p>[ADDRESS]</p></div>'
    }],
    apiKey: 'API KEY FROM GOOGLE'
  });
```

Settings for the Plugin
--------------------------------------
| SETTING | VALUE | DESCRIPTION |
| ---------- |  ---------- |  -------------------- | 
| mapLocs | [] | An array of location objects |
| zoom | 0-15 | A number in the range of 0-15, 0 being zoomed out the most, 15 being zoomed in the most |
| draggable | bool | True or False to allow for dragging of the map |
| zoomControl | bool | True or False to show or hide zoom controls on the map |
| zoomControlPosition | string | Positioning the zoom contrl on the map |
| streetViewControl | bool | True or False to show or hide street view controls on the map |
| streetViewControlPosition | string | Positioning the street view contrl on the map |
| scaleControl | bool | True or False to show or hide scale controls on the map |
| mapTypeControl | bool | True or False to show or hide map type controls on the map |
| mapTypeControlPosition | string | Positioning the map type contrl on the map |
| defaultMapType | string | Name of the default map type ('ROADMAP', 'HYBRID', 'TERRAIN', 'SATELLITE', 'CUSTOM') |
| infoWindowWidth | integer | Max Width of the infowindow popup |
| apiKey | string | API Key from Google Maps |
| customMapStyles | [] | An array of custom styles for the map to use, generate this at snazzymaps.com |
| customMapName | string | what to refer to the custom map name as |

Defaults for the Plugin
--------------------------------------
| SETTING | DEFAULT |
| ---------- |  ---------- |  -------------------- | 
| mapLocs | [] |
| zoom | 8 |
| draggable | true |
| zoomControl | true |
| zoomControlPosition | 'RIGHT_BOTTOM' |
| streetViewControl | true |
| streetViewControlPosition | 'RIGHT_BOTTOM' |
| scaleControl | true |
| mapTypeControl | true |
| mapTypeControlPosition | 'TOP_LEFT' |
| defaultMapType | 'ROADMAP' |
| infoWindowWidth | 350 |
| apiKey | '' |
| customMapStyels | [] |
| customMapName | 'Custom' |

Map Location Object
--------------------------------------
The map location array of objects is used to define the points to add to the map
```
  {
    name: '[NAME OF  LOCATION]',
    lat: [LATITUDE OF LOCATION ON MAP],
    lng: [LONGITUDE OF LOCATION ON MAP],
    infoWindowContent: '<div class="content"><h4>[TEXT FOR THE HEADING]</h4><p>[TEXT FOR THE DESCRIPTION]</p><p>[ADDRESS]</p></div>'
  }
```
The optional items to add are used for the icon:
For a SVG Icon use:
```
icon: {
    path: '[NAME OF PATH]',
    fillColor: '#[HEX VALUE]',
    fillOpacity: [FILL OPACITY 0 - 1.0],
    scale: [SCALE OF ICON ON MAP],
    strokeColor: '#[HEX VALUE]',
    strokeWeight: [STROKE WEIGHT IN POINTS],
    anchorX: ([WIDTH OF ICON] / 2), 
    anchorY: ([HEIGHT OF ICON] / 2)
  }
```

For an image Icon use:
```
  icon : 'url of image'`
```

Acceptable Positions to Use for any Control Position
--------------------------------------
```
  'BOTTOM_LEFT'
  'BOTTOM_CENTER'
  'BOTTOM_RIGHT'
  'TOP_LEFT'
  'TOP_CENTER'
  'TOP_RIGHT'
  'LEFT_TOP'
  'LEFT_CENTER'
  'LEFT_BOTTOM'
  'RIGHT_TOP'
  'RIGHT_CENTER'
  'RIGHT_BOTTOM'
```
