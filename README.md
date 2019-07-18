# Hadle Sort Machine

**Clone and run for a quick way to see Hadle Sort Machine in action.**

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/deesaa/HandleSortMachine
# Go into the repository
cd HandleSortMachine
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

# Application guide

## Настройка папок сортировки

Folder to sort - папка, файлы в которой вы будите сортировать. Выбирается папка кнопкой __Choose Folder__

Далее идет список папок, в которые, по нажатию выбранной клавиши, текущий файл будет перемещаться. 
Кнопки для перемещения можно выбрать, нажав на текстовое поле кнопки. 

__Из кнопок для сортировки доступны только числа от 0 до 9 и стрелки клавиатуры.__

Кнопка __Add Folder__ над __Move Folders__ добавляет еще одну строку с папкой и кнопкой для сортировки.
Удалить стоку сортировки можно кнопкой delete у нужной строки. 

Когда все папки выбраны и кнопки настоены, нажимаем __Start Sorting__ и соответственно приступаем к сортировке.


## Сортировка файлов

Когда вы нажимаете __Start Sorting__, открывается окно с одним файлом из папки, которую вы сортируете. Тут вы можете, посмотрев на файл, решить, в какую папку его отправить и нажать установленную для этой папки кнопку: текущий файл переместиться туда и покажется новый. 
Если вы ошиблись с перемещением файла, можете нажать __Cancel Move__ или клавишу __Esc__. Тогда вы вернетесь к предыдущему файлу в истории. 
Отменять перемещения можно только в пределах сохраненной истории перемещений.
__ВАЖНО - при смене папки, которую вы сортируете, история удаляется!__