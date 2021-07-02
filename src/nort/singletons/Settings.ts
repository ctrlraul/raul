// Singleton


const Settings = new (class {
  
  GRAPHIC_SCALE = 3.5 * window.devicePixelRatio;
  GRID_GAP = 50;
  ITEM_SPRITE_PADDING = 2;

})();


export default Settings;
