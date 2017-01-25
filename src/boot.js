var Boot = function(game) {

};

Boot.prototype = {

  preload: function(){

  },

  create: function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.disableVisibilityChange = true;
    this.game.state.start("Preload");
  }
}
