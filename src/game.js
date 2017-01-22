var Game = function(game){

  this.player = {
      clickDmg: 1,
      gold: 0,
      dps: 0,
      health: 100,
      experience: 0
  };

  // world progression
  this.level = 1;
  // how many monsters have we killed during this level
  this.levelKills = 0;
  // how many monsters are required to advance a level
  this.levelKillsRequired = 10;

};

Game.prototype = {

	create: function() {
    var state = this;

    var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
    state.game.world.height, 'forest');

    this.levelUI = this.game.add.group();
    this.levelUI.position.setTo(this.game.world.width - 150, 30);

    this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Level: ' + this.level, {
    font: '24px Arial Black',
    fill: '#fff',
    strokeThickness: 4
    }));

    this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired, {
    font: '24px Arial Black',
    fill: '#fff',
    strokeThickness: 4
    }));

    this.upgradePanel = this.game.add.image(5, 25, this.game.cache.getBitmapData('upgradePanel'));

    this.statusPanel = this.game.add.image(5, 547, this.game.cache.getBitmapData('statusPanel'));

    var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
    upgradeButtons.position.setTo(8 , 10);

    var upgradeButtonsData = [
        {icon: 'dagger', name: 'Attack', level: 0, cost: 1, purchaseHandler: function(button, player) {
            player.clickDmg += 1;
        }},
        {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 1, purchaseHandler: function(button, player) {
            player.dps += 1;
        }}
    ];

    var button;
    upgradeButtonsData.forEach(function(buttonData, index) {
        button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
        button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
        button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}));
        button.details = buttonData;
        button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'}));
        button.events.onInputDown.add(state.onUpgradeButtonClick, state);

        upgradeButtons.addChild(button);
      });


      this.dmgTextPool = this.add.group();
      var dmgText;
      for (var d=0; d<50; d++) {
          dmgText = this.add.text(0, 0, '1', {
              font: '64px Arial Black',
              fill: '#fff',
              strokeThickness: 4
          });
          // start out not existing, so we don't draw it yet
          dmgText.exists = false;
          dmgText.tween = game.add.tween(dmgText)
              .to({
                  alpha: 0,
                  y: 100,
                  x: this.game.rnd.integerInRange(100, 700)
              }, 2000, Phaser.Easing.Cubic.Out);

          dmgText.tween.onComplete.add(function(text, tween) {
              text.kill();
          });
          this.dmgTextPool.add(dmgText);
      }

      this.monsterDmgTextPool = this.add.group();
      var monsterDmgText;
      for (var d=0; d<50; d++) {
          monsterDmgText = this.add.text(0, 0, '1', {
              font: '64px Arial Black',
              fill: '#0101DF',
              strokeThickness: 4
          });
          // start out not existing, so we don't draw it yet
          monsterDmgText.exists = false;
          monsterDmgText.tween = game.add.tween(monsterDmgText)
              .to({
                  alpha: 0,
                  y: 700,
                  x: this.game.rnd.integerInRange(100, 700)
              }, 2000, Phaser.Easing.Cubic.Out);

          monsterDmgText.tween.onComplete.add(function(text, tween) {
              text.kill();
          });
          this.monsterDmgTextPool.add(monsterDmgText);
      }

      this.dpsTextPool = this.add.group();
      var dpsText;
      for (var d=0; d<50; d++) {
          dpsText = this.add.text(0, 0, '1', {
              font: '64px Arial Black',
              fill: '#FF0000',
              strokeThickness: 4
          });
          // start out not existing, so we don't draw it yet
          dpsText.exists = false;
          dpsText.tween = game.add.tween(dpsText)
              .to({
                  alpha: 0,
                  y: 100,
                  x: this.game.rnd.integerInRange(100, 700)
              }, 2000, Phaser.Easing.Cubic.Out);

          dpsText.tween.onComplete.add(function(text, tween) {
              text.kill();
          });
          this.dpsTextPool.add(dpsText);
      }

      this.coinValuePool = this.add.group();
      var coinValue;
      for (var d=0; d<50; d++) {
          coinValue = this.add.text(0, 0, '1', {
              font: '24px Arial Black',
              fill: '#FFFF00',
              strokeThickness: 4
          });
          // start out not existing, so we don't draw it yet
          coinValue.exists = false;
          coinValue.tween = game.add.tween(coinValue)
              .to({
                  alpha: 0,
                  y: 100,
                  x: this.game.rnd.integerInRange(100, 700)
              }, 2000, Phaser.Easing.Cubic.Out);

          coinValue.tween.onComplete.add(function(text, tween) {
              text.kill();
          });
          this.coinValuePool.add(coinValue);
      }

      // create a pool of gold coins
      this.coins = this.add.group();
      this.coins.createMultiple(50, 'gold_coin', '', false);
      this.coins.setAll('inputEnabled', true);
      this.coins.setAll('goldValue', 1);
      this.coins.callAll('events.onInputOver.add', 'events.onInputOver', this.onHoverCoin, this);


            var barConfigMonster = {x: this.world.centerX,
              y: this.world.centerY-150,
              width: 100,
              height: 10,
              bg: {
                  color: '#651828'
                  },
              bar: {
                  color: '#ff0000'
                  },
              animationDuration: 200,
              flipped: false
            };
            this.monsterHealthBar = new HealthBar(this.game, barConfigMonster);



      var monsterData = [
          {name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 10, maxDmg: 4, maxXp: 4, minLevel: 30, maxLevel: 15},
          {name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 10, maxDmg: 2, maxXp: 2, minLevel: 10, maxLevel: 20},
          {name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 10, maxDmg: 8, maxXp: 8, minLevel: 70, maxLevel: 30},
          {name: 'Bat',               image: 'bat',               maxHealth: 5,  maxDmg: 1, maxXp: 1, minLevel: 5, maxLevel: 5},
          {name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 10, maxDmg: 3, maxXp: 3, minLevel: 20, maxLevel: 15},
          {name: 'Deceleon',          image: 'deceleon',          maxHealth: 9, maxDmg: 1, maxXp: 1, minLevel: 9, maxLevel: 15},
          {name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 10, maxDmg: 6, maxXp: 6, minLevel: 50, maxLevel: 15},
          {name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 8,  maxDmg: 1, maxXp: 1, minLevel: 8, maxLevel: 5},
          {name: 'Green Slime',       image: 'green_slime',       maxHealth: 7,  maxDmg: 1, maxXp: 1, minLevel: 7, maxLevel: 5},
          {name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 10, maxDmg: 5, maxXp: 5, minLevel: 40, maxLevel: 15},
          {name: 'Rat',               image: 'rat',               maxHealth: 1,  maxDmg: 1, maxXp: 1, minLevel: 1, maxLevel: 5},
          {name: 'Scorpion',          image: 'scorpion',          maxHealth: 2,  maxDmg: 1, maxXp: 1, minLevel: 2, maxLevel: 5},
          {name: 'Skeleton',          image: 'skeleton',          maxHealth: 4,  maxDmg: 1, maxXp: 1, minLevel: 4, maxLevel: 5},
          {name: 'Snake',             image: 'snake',             maxHealth: 3,  maxDmg: 1, maxXp: 1, minLevel: 3, maxLevel: 5},
          {name: 'Spider',            image: 'spider',            maxHealth: 6,  maxDmg: 1, maxXp: 1, minLevel: 6, maxLevel: 5},
          {name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 10, maxDmg: 7, maxXp: 7, minLevel: 60, maxLevel: 20}
      ];




      this.playerGoldText = this.add.text(15, 557, 'Gold: ' + this.player.gold, {
          font: '24px Arial Black',
          fill: '#fff',
          strokeThickness: 4
      });

      this.playerDmgText = this.add.text(130, 557, 'DMG: ' + this.player.clickDmg, {
          font: '24px Arial Black',
          fill: '#fff',
          strokeThickness: 4
      });

      this.playerDpsText = this.add.text(245, 557, 'DPS: ' + this.player.dps, {
          font: '24px Arial Black',
          fill: '#fff',
          strokeThickness: 4
      });

      this.playerHealthText = this.add.text(360, 557, 'HP: ' + this.player.health, {
          font: '24px Arial Black',
          fill: '#fff',
          strokeThickness: 4
      });
      this.playerXpText = this.add.text(475, 557, 'XP: ' + this.player.experience, {
          font: '24px Arial Black',
          fill: '#fff',
          strokeThickness: 4
      });
      this.monsters = this.game.add.group();

      var monster;
      monsterData.forEach(function(data) {
        // create a sprite for them off screen
        monster = state.monsters.create(2000, state.game.world.centerY, data.image);
        // center anchor
        monster.anchor.setTo(0.5);
        // reference to the database
        monster.details = data;

        // use the built in health component
        var x = Math.pow(1.55,(state.level - 1));
        monster.health = monster.maxHealth = 10 * (state.level - 1 + x);
        monster.maxDmg = data.maxDmg;
        monster.maxXp = data.maxXp;
        monster.minLevel = data.minLevel;
        monster.maxLevel = data.maxLevel;
        // hook into health and lifecycle events
        monster.events.onKilled.add(state.onKilledMonster, state);
        monster.events.onRevived.add(state.onRevivedMonster, state);

        //enable input so we can click it!
        monster.inputEnabled = true;
        monster.events.onInputDown.add(state.onClickMonster, state);
      });


      do { this.currentMonster = this.monsters.getRandom();} while (this.currentMonster.minLevel != this.level);
      this.currentMonster.position.set(this.game.world.centerX, this.game.world.centerY + 50);
      //this.currentMonster.anchor.setTo(0.5);
      this.monsterInfoUI = this.game.add.group();
      this.monsterInfoUI.position.setTo(this.game.world.centerX, 175);
      //this.monsterInfoUI.anchor.setTo(0.5,0.5);
      this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
          font: '32px Arial Black',
          fill: '#fff',
          strokeThickness: 4,
          align: "center"
      }));
      this.monsterNameText.anchor.set(0.5);
      this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 30, this.currentMonster.health + ' HP', {
          font: '24px Arial Black',
          fill: '#ff0000',
          strokeThickness: 4,
          align: "center"
      }));
      this.monsterHealthText.anchor.set(0.5);
      // 100ms 10x a second
      this.dpsTimer = this.time.events.loop(1000, this.onDPS, this);
      this.monsterDpsTimer = this.time.events.loop(1000, this.onMonsterDPS, this);
    },



      onDPS: function() {
      if (this.player.dps > 0) {
          if (this.currentMonster && this.currentMonster.alive) {
              var dmg = this.player.dps;
              var healthBeforeDmg = Math.round(this.currentMonster.health);
              this.currentMonster.damage(dmg);
              // update the health text

              this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
              this.monsterHealthBar.setPercent((this.currentMonster.health/this.currentMonster.maxHealth)*100);
              var dpsText = this.dpsTextPool.getFirstExists(false);
                if (dpsText) {
                  dpsText.text = this.player.dps;
                  dpsText.reset(this.currentMonster.position.x, this.currentMonster.position.y);
                  dpsText.alpha = 1;
                  dpsText.tween.start();


                  }
              }
          }
      },

       onMonsterDPS: function() {
       if (this.currentMonster.maxDmg > 0 && this.level > 1) {
            //if (this.player.alive) {

                var dmg = this.currentMonster.maxDmg * (1 + this.level / 10) ;
                var healthBeforeDmg = Math.round(this.player.health);
                if (this.player.health > 0) {
                  this.player.health = this.player.health - dmg;
                }
                if (this.player.health <= 0) {
                  this.level--;
                  this.levelKills = 0;
                  this.currentMonster.position.set(1000, this.game.world.centerY);
                  this.playerHealthText.text = 'DEAD';

                  // pick a new monster
                  do { this.currentMonster = this.monsters.getRandom();} while (this.currentMonster.minLevel != this.level);
                  // upgrade the monster based on level
                  var x = Math.pow(1.55,(this.level - 1));
                  this.currentMonster.maxHealth = 10 * (this.level - 1 + x);
                  // make sure they are fully healed
                  this.currentMonster.revive(this.currentMonster.maxHealth);
                  this.currentMonster.position.set(this.game.world.centerX, this.game.world.centerY + 50);
                  this.levelText.text = 'Level: ' + this.level;
                  this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;

                  this.player.health=100;
                  this.playerHealthText.text = 'HP: ' + Math.round(this.player.health);
                  this.player.experience = this.player.experience - this.level * 1.25;
                  this.playerXpText.text = 'XP: ' + Math.round(this.player.experience);
                }
                // update the health text
                this.playerHealthText.text = 'HP: ' + Math.round(this.player.health);
                this.monsterHealthBar.setPercent((this.currentMonster.health/this.currentMonster.maxHealth)*100);
                  var monsterDmgText = this.monsterDmgTextPool.getFirstExists(false);
                    if (monsterDmgText) {
                      monsterDmgText.text = Math.round(dmg);
                      monsterDmgText.reset(this.currentMonster.position.x, this.currentMonster.position.y);
                      monsterDmgText.alpha = 1;
                      monsterDmgText.tween.start();

              //  }
            }
        }
    },

    onClickMonster: function(monster,pointer) {
    // apply click damage to monster

    this.currentMonster.damage(this.player.clickDmg);
    this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
    this.monsterHealthBar.setPercent((this.currentMonster.health/this.currentMonster.maxHealth)*100);
    var dmgText = this.dmgTextPool.getFirstExists(false);
      if (dmgText) {
        dmgText.text = this.player.clickDmg;
        dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
        dmgText.alpha = 1;
        dmgText.tween.start();
      }
    },

    onKilledMonster: function(monster) {
    // move the monster off screen again
    monster.position.set(1000, this.game.world.centerY);

    var coin;
    // spawn a coin on the ground
    coin = this.coins.getFirstExists(false);
    coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
    game.world.bringToTop(this.coins);
    coin.goldValue = Math.ceil(this.currentMonster.maxHealth / 15);
    this.game.time.events.add(Phaser.Timer.SECOND * 5, this.onHoverCoin, this, coin);

    this.levelKills++;

    if (this.levelKills >= this.levelKillsRequired) {
        this.level++;
        this.levelKills = 0;
        this.player.health=100;
        this.playerHealthText.text = 'HP: ' + Math.round(this.player.health);
    }

    this.player.experience = this.currentMonster.maxXp + this.player.experience;
    this.playerXpText.text = 'XP: ' + Math.round(this.player.experience);
    // pick a new monster
    do { this.currentMonster = this.monsters.getRandom();} while (this.currentMonster.minLevel != this.level);
    // upgrade the monster based on level
    var x = Math.pow(1.55,(this.level - 1));
    this.currentMonster.maxHealth = 10 * (this.level - 1 + x);

    // make sure they are fully healed
    this.currentMonster.revive(this.currentMonster.maxHealth);
    this.currentMonster.position.set(this.game.world.centerX, this.game.world.centerY + 50);
    this.levelText.text = 'Level: ' + this.level;
    this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;

    },



    onRevivedMonster: function(monster) {
    monster.position.set(this.game.world.centerX, this.game.world.centerY);
    // update the text display
    this.monsterNameText.text = monster.details.name;
    this.monsterHealthText.text = monster.health + 'HP';
    },


    onHoverCoin: function(coin) {
      if (!coin.alive) {
      return;
    }
      // give the player gold
      this.player.gold += coin.goldValue;
      // update UI
      this.playerGoldText.text = 'Gold: ' + this.player.gold;

      var coinValue = this.coinValuePool.getFirstExists(false);
        if (coinValue) {
          coinValue.text = coin.goldValue + 'Gold';
          coinValue.reset(coin.position.x, coin.position.y);
          coinValue.alpha = 1;
          coinValue.tween.start();
        }
      // remove the coin
      coin.kill();
    },


    onUpgradeButtonClick: function(button, pointer) {
    // make this a function so that it updates after we buy
    function getAdjustedCost() {
        return Math.ceil(button.details.cost + (button.details.level * 1.46));
    }

    if (this.player.gold - getAdjustedCost() >= 0) {
        this.player.gold -= getAdjustedCost();
        this.playerGoldText.text = 'Gold: ' + this.player.gold;

        button.details.level++;
        button.text.text = button.details.name + ': ' + button.details.level;
        button.costText.text = 'Cost: ' + getAdjustedCost();

        button.details.purchaseHandler.call(this, button, this.player);

        this.playerDmgText.text = 'DMG: ' + this.player.clickDmg;
        this.playerDpsText.text = 'DPS: ' + this.player.dps;

    }



	},

	update: function() {

	}

};
