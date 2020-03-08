## `gatsby-plugin-realfavicongenerator`

Generate webmanifest, favicon and device-specific icons for your PWA using [realfavicongenerator.net](https://realfavicongenerator.net/).

### Installation
```bash
yarn add gatsby-plugin-realfavicongenerator
# or
npm install --save gatsby-plugin-realfavicongenerator
```

then, add it to the `plugins` section in you `gastby-config.js`:

```javascript 
module.exports = {
    plugins: [
        resolve: `gatsby-plugin-realfavicongenerator`,
        options: {
            // see below
        },
    ],
};
```

### Options
| key                        	| required 	| default value                                                                         	| description                                                                                                                                                                                                                                                                                            	|
|----------------------------	|----------	|---------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| apiKey                     	| ✔️        	| -                                                                                     	| API-Key for the [realfavicongenerator.net API](https://realfavicongenerator.net/api/#register_key).                                                                                                                                                                                                    	|
| masterPicture              	| ✔️        	| -                                                                                     	| path to your master picture from which the icons should be generated. Should be at least 250x250.                                                                                                                                                                                                      	|
| appName                    	| ✔️        	| -                                                                                     	| Name of you PWA/Website                                                                                                                                                                                                                                                                                	|
| startUrl                   	| ❌        	| `/`                                                                                   	| Starturl of your PWA                                                                                                                                                                                                                                                                                   	|
| themeColor                 	| ✔️        	| -                                                                                     	| The theme color of your PWA                                                                                                                                                                                                                                                                            	|
| display                    	| ❌        	| `standalone`                                                                          	| Either `standalone` or `browser`. Controlls how your PWA behaves when added to the home screen                                                                                                                                                                                                         	|
| forceOrientation           	| ❌        	| -                                                                                     	| Can be `portrait` or `landscape`. If set, forces the orientation of your PWA                                                                                                                                                                                                                           	|
| defaultBackgroundColor     	| ❌        	| -                                                                                     	| Default background color for the generated icons                                                                                                                                                                                                                                                       	|
| defaultMargin              	| ❌        	| -                                                                                     	| Default margin to add around the `masterPicture` when generating the icons                                                                                                                                                                                                                             	|
| compression                	| ❌        	| 3                                                                                     	| Compression factor for the generated icons. Can be a number from 1 to 5                                                                                                                                                                                                                                	|
| scalingAlgorithm           	| ❌        	| `Lanczos`                                                                             	| The scaling algorithm used to scale the master pciture. Possible options: `'Mitchell' | 'NearestNeighbor'| 'Cubic'| 'Bilinear'| 'Lanczos'| 'Spline'`                                                                                                                                                   	|
| ios                        	| ❌        	| `{enabled: true, onlyDefaultIcons: true, legacyIcons: false, precomposedIcons: true}` 	| Options for the iOS icons. See below                                                                                                                                                                                                                                                                   	|
| windows                    	| ❌        	| `{enabled: true}`                                                                     	| Options for the Windows icons. See below                                                                                                                                                                                                                                                               	|
| android                    	| ❌        	| `{enabled: true, legacyIcons: false, lowResIcons: false}`                             	| Options for the Android/Chrome icons. See below                                                                                                                                                                                                                                                        	|
| safariPinnedTab            	| ❌        	| `{enabled: true, silhouette: true, threshold: 60}`                                    	| Options for the Safari pinned tab icon. See below                                                                                                                                                                                                                                                      	|
| openGraph                  	| ❌        	| `{enabled: false}`                                                                    	| Options for the open graph images. See below                                                                                                                                                                                                                                                           	|
| faviconRequestOverride     	| ❌        	| -                                                                                     	| Option to override specific options from the `favicon_generation` sent to the [realfavicongenerator.net  API ](https://realfavicongenerator.net/api/non_interactive_api). Use with caution                                                                                                             	|
| transformGeneratedManifest 	| ❌        	| -                                                                                     	| callback fucntion to transform/customize the content of the generated `.webmanifest` file. Signature: `(manifest: {[key: string]: any}) => {[key: string]: any}`. The returned object from this function is then converted back to JSON and replaces the content of the generated `.webmanifest` file  	|

#### iOS
| key                        	| required 	| default value 	| description                                                                                                          	|
|----------------------------	|----------	|---------------	|----------------------------------------------------------------------------------------------------------------------	|
| enabled                    	| ✔️        	| `true`        	| Enable/Disable generation of iOS specific icons                                                                      	|
| masterPicture              	| ❌        	| -             	| Provide a specific image for the iOS icons. If not provided, master `masterPicture` from global options will be used 	|
| margin                     	| ❌        	| -             	| Add margin around your `masterPicture`. Can be a number (pixels) or string (percentage, e.g. '5%')                   	|
| backgroundColor            	| ❌        	| -             	| Background color for the icons                                                                                       	|
| onlyDefaultIcons           	| ❌        	| `true`        	| Generate only default icons                                                                                          	|
| legacyIcons                	| ❌        	| `false`       	| Generate also legacy icons                                                                                           	|
| precomposedIcons           	| ❌        	| `true`        	| Generate precomposed icons                                                                                           	|
| **startupImage**           	| ❌        	| -             	| Options for the image used as startup image/splash screen                                                            	|
| startupImage.masterPicture 	| ✔️        	| -             	| Picture to use as startup image/splash screen                                                                        	|
| margin                     	| ❌        	| -             	| Margin added around the startup image/splash screen                                                                  	|
| backgroundColor            	| ❌        	| -             	| Background color for the startup image/splash screen                                                                 	|

#### Windows/IE/Edge
| key             	| required 	| default value 	| description                                                                                                              	|
|-----------------	|----------	|---------------	|--------------------------------------------------------------------------------------------------------------------------	|
| enabled         	| ✔️        	| `true`        	| Enable/Disable generation of the windows icons                                                                           	|
| masterPicture   	| ❌        	| -             	| Provide a specific image for the windows icons. If not provided, master `masterPicture` from global options will be used 	|
| backgroundColor 	| ❌        	| -             	| Background color for the images                                                                                          	|
| silhouette      	| ❌        	| -             	| Convert icons to silhouette                                                                                              	|

#### Android/Chrome
| key              	| required 	| default value 	| description                                                                                                              	|
|------------------	|----------	|---------------	|--------------------------------------------------------------------------------------------------------------------------	|
| enabled          	| ✔️        	| `true`        	| Enable/Disable generation of Android specific icons                                                                      	|
| masterPicture    	| ❌        	| -             	| Provide a specific image for the Android icons. If not provided, master `masterPicture` from global options will be used 	|
| margin           	| ❌        	| -             	| Add margin around your `masterPicture`. Can be a number (pixels) or string (percentage, e.g. '5%')                       	|
| backgroundColor  	| ❌        	| -             	| Background color for the icons                                                                                           	|
| legacyIcons      	| ❌        	| `false`       	| Generate also legacy icons                                                                                               	|
| lowResIcons      	| ❌        	| `false`       	| Generate low resolution icons                                                                                            	|
| existingManifest 	| ❌        	| -             	| Path to a template `.webmanifest` file, wich can be used to define additional properties                                 	|

#### Safari Pinned Tab Icon
| key             	| required 	| default value 	| description                                                                                                                       	|
|-----------------	|----------	|---------------	|-----------------------------------------------------------------------------------------------------------------------------------	|
| enabled         	| ✔️        	| `true`        	| Enable/Disable generation of Safari pinned tab icon                                                                               	|
| masterPicture   	| ❌        	| -             	| Provide a specific image for the Safari pinned tab icon. If not provided, master `masterPicture` from global options will be used 	|
| margin          	| ❌        	| -             	| Add margin around your `masterPicture`. Can be a number (pixels) or string (percentage, e.g. '5%')                                	|
| backgroundColor 	| ❌        	| -             	| Background color for the icons                                                                                                    	|
| threshold       	| ❌        	| `60`          	| Threshold for converting to silhouette. A number between 0 and 100                                                                	|
| silhouette      	| ❌        	| `true`        	| Convert icon to silhouette                                                                                                        	|

#### OpenGraph
| key             	| required 	| default value 	| description                                                                                                                 	|
|-----------------	|----------	|---------------	|-----------------------------------------------------------------------------------------------------------------------------	|
| enabled         	| ✔️        	| `false`       	| Enable/Disable generation of OpenGraph images                                                                               	|
| masterPicture   	| ❌        	| -             	| Provide a specific image for the OpenGraph images. If not provided, master `masterPicture` from global options will be used 	|
| margin          	| ❌        	| -             	| Add margin around your `masterPicture`. Can be a number (pixels) or string (percentage, e.g. '5%')                          	|
| backgroundColor 	| ❌        	| -             	| Background color for the images                                                                                             	|
| ratio           	| ❌        	| -             	| Aspect ration of the generated images                                                                                       	|

### How to use

1. git clone --depth 1 -b master https://github.com/devrchancay/gatsby-plugin-starter.git
2. Change the "name" in `package.json` with the conversion of gatsby plugins.
3. Happy Hacking
