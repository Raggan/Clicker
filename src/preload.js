var Preload = function(game){};

Preload.prototype = {

	preload: function(){
    this.game.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
    this.game.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
    this.game.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
    this.game.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
    this.game.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
    this.game.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
    this.game.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
    this.game.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
    this.game.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
    this.game.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
    this.game.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
    this.game.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
    this.game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
    this.game.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
    this.game.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
    this.game.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');
		this.game.load.image('slash', 'assets/slash_001.gif');
    this.game.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
    this.game.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');
    this.game.load.image('swordIcon1', 'assets/496_RPG_icons/S_Sword01.png');
    this.game.load.image('forest', 'assets/Background/Forrest.png');

    var bmd = this.game.add.bitmapData(250, 120);
    bmd.ctx.fillStyle = '#9a783d';
    bmd.ctx.strokeStyle = '#35371c';
    bmd.ctx.lineWidth = 12;
    bmd.ctx.fillRect(0, 0, 250, 120);
    bmd.ctx.strokeRect(0, 0, 250, 120);
    this.game.cache.addBitmapData('upgradePanel', bmd);

    var buttonImage = this.game.add.bitmapData(476, 48);
    buttonImage.ctx.fillStyle = '#e6dec7';
    buttonImage.ctx.strokeStyle = '#35371c';
    buttonImage.ctx.lineWidth = 4;
    buttonImage.ctx.fillRect(0, 0, 225, 48);
    buttonImage.ctx.strokeRect(0, 0, 225, 48);
    this.game.cache.addBitmapData('button', buttonImage);

    var status_bar_panel = this.game.add.bitmapData(790, 50);
    status_bar_panel.ctx.fillStyle = '#9a783d';
    status_bar_panel.ctx.strokeStyle = '#35371c';
    status_bar_panel.ctx.lineWidth = 12;
    status_bar_panel.ctx.fillRect(0, 0, 790, 50);
    status_bar_panel.ctx.strokeRect(0, 0, 790, 50);
    this.game.cache.addBitmapData('statusPanel', status_bar_panel);
	},

	create: function(){
		this.game.state.start("Game");
	}
}
