//==============================================================================
// GRB_NewGamePlus.js
//==============================================================================

/*:
 * @target MV MZ
 * @plugindesc Adds a new menu item accessible after completing the game
 * @author Garbata Team
 * @url https://rpgukr.one/GRB_NewGamePlus
 *
 * @command newgame+ on
 * @text NewGame+ ON
 * @desc Enables the "New Game+" menu item
 *
 * @command newgame+ off
 * @text NewGame+ OFF
 * @desc Disables the "New Game+" menu item
 *
 * @param menuItemText
 * @text Menu item text
 * @desc Label of the new menu item in the title screen
 * @type text
 * @default New Game+
 *
 * @param mapId
 * @text Start map ID
 * @desc From which map will New Game+ start
 * @type number
 * @min 1
 * @max 999
 *
 * @param x
 * @text Start tile X
 * @desc Number of tiles from leftmost tile column to the tile
 * where the New Game+ starts.
 * @type number
 * @min 0
 * @max 255
 *
 * @param y
 * @text Start tile Y
 * @desc Number of tiles from topmost tile row to the tile
 * where the New Game+ starts.
 * @type number
 * @min 0
 * @max 255
 *
 * @help
 * New Game+ is a special kind of new game that starts after the player has
 * completed the game one time.
 *
 * It's started from a new menu item in the main menu that is invisible by
 * default, but becomes visible later. The text of this menu item is set by the
 * "Menu item text" parameter.
 *
 * This menu item starts the game like usual, but from a different place. This
 * place is specified by "Start map ID", "Start tile X" and "Start tile Y"
 * parameters. They can be obtained as follows:
 *
 * - Open the map which you want to use for the start position.
 * - Switch to the Event mode by pressing F6.
 * - Left-click on the place where you want to start the game in the New Game+
 * mode.
 * - Now, look at the lowest part of the window screen. There is a status bar
 * separated into several labels, like this:
 *  |               |  002:Рыбацкая деревня (40x40)   | 100% | 18,12 |       |
 * - The first (leftmost) label is always empty.
 * - Start map ID is the second number in the second label (before :), use it
 * in the plugin settings
 * - The third item is zoom, it can be ignored
 * - The forth item contans X and Y coordinates, separated by comma.
 * Use the first number as Start Map X, and the second number as Start Map Y.
 *
 * To enable or disable the "New Game+" menu item, use the "Plugin Command"
 * event command. In MV, use the following commands:
 * newgame+ on
 * newgame+ off
 * In RPG Maker MZ, select the event command from the list.
 *
 * This is version 1.1 of the plugin, published at 2025-02-06.
 *
 * Thanks to Tarwix <https://tarwix.itch.io/> for the help with a config bug.
 *
 * This plugin is placed into public domain according to the CC0 public domain
 * dedication. See https://creativecommons.org/publicdomain/zero/1.0/ for more
 * information.
 */
/*:uk
 * @target MV MZ
 * @plugindesc Додає новий пункт меню, доступний пісня перемоги
 * @author Команда Гарбата
 * @url https://рпг.укр/GRB_NewGamePlus
 *
 * @command newgame+ on
 * @text Нова_Гра+ Увімкнена
 * @desc Показує пункт меню "Нова гра+"
 *
 * @command newgame+ off
 * @text Нова_Гра+ Вимкнена
 * @desc Приховує пункт меню "Нова гра+"
 *
 * @param menuItemText
 * @text Текст пункту меню
 * @desc Текст нового пункту меню на титульному екрані
 * @type text
 * @default Нова гра+
 *
 * @param mapId
 * @text № початкової карти
 * @desc З якої карти починатиметься Нова гра+
 * @type number
 * @min 1
 * @max 999
 *
 * @param x
 * @text X початкової клітини
 * @desc Кількість клітин від найлівішого стовпчика клітин
 * до клітини, де починатиметься Нова гра+.
 * @type number
 * @min 0
 * @max 255
 *
 * @param y
 * @text Y початкової клітини
 * @desc Кількість клітин від верхнього рядка клітин
 * до клітини, де починатиметься Нова гра+.
 * @type number
 * @min 0
 * @max 255
 *
 * @help
 * Нова гра+ — це особливий початок гри, який стає доступним після перемоги
 * в основній грі.
 *
 * Її можна почати через пункт в основному меню, який спочатку невидимий, але
 * з'являється потім. Текст цього пункту меню можна вказати в параметрі
 * «Текст пункту меню».
 *
 * Цей пункт меню починає гру так, як і звичайний, але в іншому місці. Це місце
 * вказується параметрами «№ початкової карти», «X початкової клітини» та
 * «Y початкової клітини». Їх можна довідатися таким чином:
 *
 * - Відкрийте карту, на якій ви хочете починати Нову гру+.
 * - Перемикніться на режим Подій клавішею F6.
 * - Натисніть лівою кнопкою миші по місцю, де ви хочете починати Нову гру+.
 * - Після цього подивіться на нижню частину екрана. Там є рядок стану,
 * розділений на декілька пунктів, приблизно таким чином:
 *  |               |  002:Рибальське село (40x40)   | 100% | 18,12 |       |
 * - Перший (найлівіший) пункт завжди пустий.
 * - В другому пункті можна побачити номер початкової карти (перед :), вкажіть
 * його в налаштуваннях плагіну
 * - Третій пункт — масштаб, пропустіть його
 * - В четвертому пункті вказано координати X та Y, розділені комою.
 * Вкажіть перше число як X початкової клітини, а друге — як Y початкової
 * клітини.
 *
 * Щоб увімкнути або вимкнути пункт меню «Нова гра+», використовуйте команду
 * подій «Команда плагіну». В MV використовуйте такі команди:
 * нова_гра+ увімкнена
 * нова_гра+ вимкнена
 * В RPG Maker MZ оберіть команду плагіну зі списку.
 *
 * Це версія 1.1 плагіна, опублікована 2025-02-06.
 *
 * Дякую Tarwix <https://tarwix.itch.io/> за допомогу з помилкою з читанням
 * конфігурації.
 *
 * Цей плагін передано до суспільного надбання згідно з CC0. Детальніше див.
 * на сторінці https://creativecommons.org/publicdomain/zero/1.0/deed.uk
 */
/*:be
 * @target MV MZ
 * @plugindesc Дадае новы пункт меню, даступны пасля перамогі
 * @author Каманда Гарбата
 * @url https://рпг.укр/GRB_NewGamePlus
 *
 * @command newgame+ on
 * @text Новая_гульня+ уключаная
 * @desc Паказвае пункт меню «Новая гульня+»
 *
 * @command newgame+ off
 * @text Новая_гульня+ выключаная
 * @desc Прыхоўвае пункт меню «Новая гульня+»
 *
 * @param menuItemText
 * @text Тэкст пункта меню
 * @desc Тэкст новага пункта меню на тытульным экране
 * @type text
 * @default Новая гульня+
 *
 * @param mapId
 * @text № пачатковай карты
 * @desc З якой карты пачынаецца Новая гульня+
 * @type number
 * @min 1
 * @max 999
 *
 * @param x
 * @text X пачатковай клеткі
 * @desc Колькасць клетак ад найлявейшага слупочка клетак
 * да клеткі, дзе будзе пачынацца Новая гульня+.
 * @type number
 * @min 0
 * @max 255
 *
 * @param y
 * @text Y пачатковай клеткі
 * @desc Колькасць клетак ад верхняга радка клетак
 * да клеткі, дзе будзе пачынацца Новая гульня+.
 * @type number
 * @min 0
 * @max 255
 *
 * @help
 * Новая гульня+ — гэта асаблівы пачатак гульня, які робіцца даступным пасля
 * перамогі ў асноўнай гульні.
 *
 * Яе можна пачаць праз пункт у тытульным меню, які спачатку недаступны, але
 * з'яўляецца потым. Тэкст гэтага пункта меню можна ўвесці ў параметры
 * «Тэкст пункта меню».
 *
 * Гэты пункт меню пачынае гульню гэтак жа, як і звычайны пункт «Новая гульня»,
 * але ў іншым месцы. Гэта месца задаецца параметрамі «№ пачатковай карты»,
 * «X пачатковай клеткі» і «Y пачатковай клеткі». Іх можна даведацца такім
 * чынам:
 *
 * - Адкрыйце карту, на якой вы хочаце пачынаць Новую гульню+.
 * - Пераключыцеся на Рэжым падзей клавішай F6.
 * - Пстрыкніце левай кнопкай мышы па месцы, дзе вы хочаце пачынаць Новую
 * гульню+.
 * - Пасля гэтага паглядзіце на ніжнюю частку экрана. Там ёсць радок стану,
 * падзелены на некалькі пунктаў, прыблізна такім чынам:
 *  |               |  002:Рыбацкая вёска (40x40)   | 100% | 18,12 |       |
 * - Першы (найлявейшы) пункт заўсёды пусты
 * - У другім пункце можна ўбачыць нумар пачатковай карты (перад :), увядзіце
 * яго ў наладках плагіна
 * - Трэці пункт — масштаб, прапусціце яго
 * - У чацвёртым пункце паказваюцца каардынаты X і Y, раздзеленыя коскай.
 * Увядзіце першы лік як X пачатковай клеткі, а другі лік — як Y пачатковай
 * клеткі.
 *
 * Каб уключыць ці выключыць пункт меню «Новая гульня+», выкарыстоўвайце каманду
 * падзей «Каманда плагіна». У MV выкарыстоўвайце такія каманды:
 * новая_гульня+ уключаная
 * новая_гульня+ выключаная
 * В RPG Maker MZ оберіть команду плагіну зі списку.
 *
 * Гэта версія 1.1 плагіна, апублікаваная 2025-02-06.
 *
 * Дзякуй Tarwix <https://tarwix.itch.io/> за дапамогу з памылкай з чытаннем
 * канфігурацыі.
 *
 * Гэты плагін перададзены ў грамадскі набытак згодна з CC0. Падрабязней гл.
 * на старонцы https://creativecommons.org/publicdomain/zero/1.0/deed.be
 */
/*:ru
 * @target MV MZ
 * @plugindesc Добавляет новый пункт меню, доступный после победы
 * @author Команда Гарбата
 * @url https://rpgukr.one/GRB_NewGamePlus
 *
 * @command newgame+ on
 * @text Новая_игра+ включена
 * @desc Показывает пункт меню «Новая игра+»
 *
 * @command newgame+ off
 * @text Новая_игра+ отключена
 * @desc Скрывает пункт меню «Новая игра+»
 *
 * @param menuItemText
 * @text Текст пункта меню
 * @desc Текст нового пункта меню на титульном экране
 * @type text
 * @default Новая игра+
 *
 * @param mapId
 * @text № начальной карты
 * @desc С какой карты начинается Новая игра+
 * @type number
 * @min 1
 * @max 999
 *
 * @param x
 * @text X начальной клетки
 * @desc Количество клеток от самого левого столбца клеток
 * до клетки, где будет начинаться Новая игра+.
 * @type number
 * @min 0
 * @max 255
 *
 * @param y
 * @text Y начальной клетки
 * @desc Количество клеток от самого верхнего ряда клеток
 * до клетки, где будет начинаться Новая игра+.
 * @type number
 * @min 0
 * @max 255
 *
 * @help
 * Новая игра+ — это особое начало игры, которое делается доступным после победы
 * в основной игре.
 *
 * Начать игру таким способом можно через пункт в титульном меню, который
 * вначале недоступен и появляется позже. Текст этого пункта меню можно указать
 * в параметре «Текст пункта меню».
 *
 * Этот пункт меню начинает игру так же, как и обычный пункт «Новая игра», но
 * с другого места. Это место задаётся параметрами «№ начальной карты»,
 * «X начальной клетки» и «Y начальной клетки». Их можно узнать таким образом:
 *
 * - Откройте карту, на которой вы хотите начать Новую игру+.
 * - Переключитесь на Режим событий клавишей F6.
 * - Щёлкните левой кнопкой мыши по месту, где вы хотите начинать Новую игру+.
 * - После этого посмотрите на нижнюю часть экрана. Там есть строка состояния,
 * разделённая не несколько пунктов, примерно таким образом:
 *  |               |  002:Рыбацкая деревня (40x40)   | 100% | 18,12 |       |
 * - Первый (самый левый) пункт всегда пустой
 * - На втором пункте можно увидеть номер начальной карты (перед :), введите его
 * в настройках плагина.
 * - Третий пункт — масштаб, пропустите его
 * - В четвёртом пункте показываются координаты X и Y, разделённые запятой.
 * Введите первое число как X начальной клетки, а второе — как Y начальной
 * клетки.
 *
 * Чтобы включить или выключить пункт меню «Новая игра+», используйте команду
 * событий «Команда плагина». В MV используйте такие команды:
 * новая_игра+ включена
 * новая_игра+ отключена
 * В RPG Maker MZ выберите команду плагина из списка.
 *
 * Это версия 1.1 плагина, опубликованная 2025-02-06.
 *
 * Спасибо Tarwix <https://tarwix.itch.io/> за помощь с ошибкой при чтении
 * конфигурации.
 *
 * Этот плагин передан в общественное достояние согласно CC0. Подробнее см. на
 * странице https://creativecommons.org/publicdomain/zero/1.0/deed.ru
 */

(function () {

var pluginName = 'GRB_NewGamePlus';
var parameters = PluginManager.parameters(pluginName);

/**
 * Checks if the title command window needs a "New Game+" menu item.
 */
Window_TitleCommand.prototype.needsNewGamePlus = function () {
  if (parameters.mapId === undefined || parameters.x === undefined
        || parameters.y === undefined) {
    return false;
  }

  return ConfigManager.newGamePlusEnabled;
};

var Window_TitleCommand_addCommand = Window_Command.prototype.addCommand;
/**
 * Add a new command to the title command window. This is the default MV/MZ
 * function, aliased to insert "New Game+" after a predefined command
 * (by default after "New Game", but this can be overriden by aliasing
 * symbolBeforeNewGamePlus).
 *
 * @param {string} name Text of the menu item, as shown to the playes
 * @param {string} symbol Internal code of the menu item
 * @param {boolean} enabled Specified whether the menu item is displayed as
 * enabled (by default, all menu items are enabled)
 * @param {any} ext Additional data associated with the menu command
 * @return {any} By default returns undefined, but can be aliased
 */
Window_TitleCommand.prototype.addCommand = function(name, symbol, enabled, ext) {
  var result = Window_TitleCommand_addCommand.call(
      this, name, symbol, enabled, ext
  );
  if (symbol === this.symbolBeforeNewGamePlus()) {
    this.addNewGamePlusCommand();
  }
  return result;
};

/**
 * Returns the symbol of the menu item after which 'New Game+' will be inserted.
 *
 * @return {string} Name of the symbol
 */
Window_TitleCommand.prototype.symbolBeforeNewGamePlus = function () {
  return 'newGame';
};

/**
 * Adds a 'New Game+' menu item, if needed.
 */
Window_TitleCommand.prototype.addNewGamePlusCommand = function() {
  this.hasNewGamePlus = this.needsNewGamePlus();
  if (this.hasNewGamePlus) {
    this.addCommand(parameters.menuItemText || 'New Game+', 'newGamePlus');
  }
};

/**
 * Checks if the window corresponds to the current configuration.
 * @return {boolean} True if the window needs to be recteated
 */
Window_TitleCommand.prototype.needsRecreatingForNewGamePlus = function () {
  return !!this.hasNewGamePlus != !!this.needsNewGamePlus();
}

var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
/**
 * Creates a command window, adds menu item handlers. This is the default MV/MZ
 * function, aliased to add 'New Game+' handler.
 */
Scene_Title.prototype.createCommandWindow = function() {
  Scene_Title_createCommandWindow.call(this);
  this.addNewGamePlusHandler();
};

var Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
/**
 * MZ-only. Calculates the sizes of the command window. Aliased to create bigger
 * windows if "New Game+" command is visible.
 * @return {Rectangle}
 */
Scene_Title.prototype.commandWindowRect = function() {
  var rect = Scene_Title_commandWindowRect.call(this);
  if (ConfigManager.newGamePlusEnabled) {
    return this.enlargeCommandWindowSizeForNewGamePlus(rect);
  }

  return rect;
}

/**
 * MZ-only. Returns changed dimensions of the command window if "New Game+"
 * command is visible.
 * @param {Rectangle} Original rectangle
 * @return {Rectangle} Changed rectangle
 */
Scene_Title.prototype.enlargeCommandWindowSizeForNewGamePlus = function (rect) {
  var threeItemHeight = this.calcWindowHeight(3, true);
  var fourItemHeight = this.calcWindowHeight(4, true);
  var hDiff = fourItemHeight - threeItemHeight;

  return new Rectangle(
    rect.x,
    rect.y - hDiff / 2,
    rect.width,
    rect.height + hDiff
  );
}

/**
 * Adds a handler for the "New Game+" menu item.
 */
Scene_Title.prototype.addNewGamePlusHandler = function() {
  this._commandWindow.setHandler('newGamePlus', this.commandNewGamePlus.bind(this));
};

/**
 * The handler function that is executed when "New Game+" menu item is selected.
 */
Scene_Title.prototype.commandNewGamePlus = function() {
    DataManager.setupNewGamePlus();
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

var Scene_Title_update = Scene_Title.prototype.update;
/**
 * Updates the title scene. This function is called every frame (1/60th part
 * of the second). Aliased to re-create the command window if the "New Game+
 * enabled?" configuration changed since the scene was created.
 */
Scene_Title.prototype.update = function() {
  if (this._commandWindow &&
                  this._commandWindow.needsRecreatingForNewGamePlus()) {
    this.recteateCommandWindowForNewGamePlus();
  }
  Scene_Title_update.call(this);
}

/**
 * Recreates the command window to take new configuration into account.
 */
Scene_Title.prototype.recteateCommandWindowForNewGamePlus = function() {
  this._commandWindow.destroy();
  delete this._commandWindow;
  this.createCommandWindow();
}

/**
 * Sets up the "New Game+" type of game. It is basically same as the new game,
 * but the game starts in a different location.
 */
DataManager.setupNewGamePlus = function() {
  this.setupNewGame();
  $gamePlayer.reserveTransfer(
    parseInt(parameters.mapId),
    parseInt(parameters.x),
    parseInt(parameters.y)
  );
};

/**
 * @var {boolean} newGamePlusEnabled Default value (for MV) of the "New Game+
 * enabled?" configuration setting. Unlike other configuration settings, it is
 * not visible in the Config Scene, but it's stored here for simplicity.
 */
ConfigManager.newGamePlusEnabled = false;

var ConfigManager_makeData = ConfigManager.makeData;
/**
 * Prepare config data for saving. Aliased to save newGamePlusEnabled.
 * @return {object} JSON-stringifiable array
 */
ConfigManager.makeData = function() {
  var config = ConfigManager_makeData.call(this);
  return this.addNewGamePlusEnabledToData(config);
};

/**
 * Adds a "New Game+ enabled?" configuration setting to the data that will
 * be saved.
 * @param {object} JSON-parseable object that will be modified
 * @return {object} The same object
 */
ConfigManager.addNewGamePlusEnabledToData = function(config) {
  if (this.newGamePlusEnabled) {
    config.newGamePlusEnabled = this.newGamePlusEnabled;
  }
  return config;
};

var ConfigManager_applyData = ConfigManager.applyData;
/**
 * Read the configuration from the parsed JSON. Aliased to read the "New Game+
 * enabled?" configuration.
 */
ConfigManager.applyData = function(config) {
  ConfigManager_applyData.apply(this, arguments);
  this.newGamePlusEnabled = this.readFlag(config, 'newGamePlusEnabled', false);
                  //The last parameter is the default value in MZ
};

var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
/**
 * Parse MV-style plugin command. Aliased to enable "newgame+ enable" and
 * "newgame+ disable" event commands.
 *
 * @param {string} command The first word of the plugin command (separated by
 * spaces)
 * @param {string[]} args The rest of the words of the event command
 */
Game_Interpreter.prototype.pluginCommand = function (command, args) {
  var string = (command + ' ' + args.join(' ')).trim();

  if (command.match(/new_?game\+|нова_?гра\+|новая_?игра\+|новая_?гульня\+/i)
                                                        && args.length === 1) {
    var isOn = !!args[0].match(/on|enabled?|ув|увімкнути|ввімкнути|вв|увімкнено|увімкнена|ввімкнено|ввімкнена|вкл|включить|включена|укл|уключыць|уключаная?/i);
    var isOff = !!args[0].match(/off|disabled?|вим|вимкнути|вимкнено|вимкнуто|вимкнено|вимкнена|вимкнута|выкл|выключить|выключена|выключыць|выключаная|откл|отключена|адкл|адключаная?/i);
    var needsChange = (isOn && !ConfigManager.newGamePlusEnabled) ||
                        (isOff && ConfigManager.newGamePlusEnabled);

    if (needsChange) {
      ConfigManager.newGamePlusEnabled = isOn;
      ConfigManager.save();
      return;
    }
  }

  return Game_Interpreter_pluginCommand.call(this, command, args);
}

if (Utils.RPGMAKER_NAME == 'MZ') {
  PluginManager.registerCommand(pluginName, "newgame+ on", function (args) {
    ConfigManager.newGamePlusEnabled = true;
    ConfigManager.save();
  });

  PluginManager.registerCommand(pluginName, "newgame+ off", function (args) {
    ConfigManager.newGamePlusEnabled = false;
    ConfigManager.save();

  });
}

})();