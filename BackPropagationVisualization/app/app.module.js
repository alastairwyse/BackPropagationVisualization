var app = angular.module("backpropagationVisualization", ['ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngSanitize']);
app.config(function ($mdThemingProvider) {
    /*
    $mdThemingProvider.theme('default').dark()
        .primaryPalette('light-blue')
        .accentPalette('light-blue');
    */
    
    // TODO: Defined a custom pallete (matching material 'light-blue') in the hope of being able to set css colors to palette entries (e.g. 'A200'), but haven't found a way to do this yet
    $mdThemingProvider.definePalette("backpropagationVisualizationColorPalette", {
        '50': 'e1f5fe',
        '100': 'b3e5fc',
        '200': '81d4fa',
        '300': '4fc3f7',
        '400': '29b6f6',
        '500': '03a9f4',
        '600': '039be5',
        '700': '0288d1',
        '800': '0277bd',
        '900': '01579b',
        'A100': '80d8ff',
        'A200': '40c4ff',
        'A400': '00b0ff',
        'A700': '0091ea',
        'contrastDefaultColor': 'dark'
    });

    $mdThemingProvider.theme('default').dark()
        .primaryPalette('backpropagationVisualizationColorPalette')
        .accentPalette('backpropagationVisualizationColorPalette');

});