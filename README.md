<h1 align="center">
    Gympoint Backend
</h1>

<h4 align="center">
  Backend for a gym management app. Until now its main objective is to be a project to study Javascript.
</h4>
<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/haple/gympoint-backend.svg">

  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/haple/gympoint-backend.svg">

  <!--FALTA COLOCAR A QUALIDADE DE CÓDIGO-->

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/haple/gympoint-backend.svg">
  <a href="https://github.com/haple/gympoint-backend.svg/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/haple/gympoint-backend.svg">
  </a>

  <a href="https://github.com/haple/gympoint-backend.svg/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/haple/gympoint-backend.svg">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/haple/gympoint-backend.svg">
</p>

<p align="center">
  <a href="#technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#requirements">Requirements</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#install">Install</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#configure">Configure</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#running">Running</a>
</p>


## Technologies

This project was developed at the [RocketSeat GoStack Bootcamp](https://rocketseat.com.br/bootcamp) with the following technologies:

-  [VS Code][vc] with [ESLint][vceslint]
-  [Node.js](https://nodejs.org)
-  [Express](https://expressjs.com/)
-  [nodemon](https://nodemon.io/)
-  [Sucrase](https://github.com/alangpierce/sucrase)
-  [Docker](https://www.docker.com/docker-community)
-  [Sequelize](http://docs.sequelizejs.com/)
-  [PostgreSQL](https://www.postgresql.org/)
-  [node-postgres](https://www.npmjs.com/package/pg)
-  [JWT](https://jwt.io/)
-  [Multer](https://github.com/expressjs/multer)
-  [Bcrypt](https://www.npmjs.com/package/bcrypt)
-  [Yup](https://www.npmjs.com/package/yup)
-  [date-fns](https://date-fns.org/)
-  [DotEnv](https://www.npmjs.com/package/dotenv)
<!-- -  [Youch](https://www.npmjs.com/package/youch) -->
<!-- -  [Sentry](https://sentry.io/) -->
<!-- -  [Bee Queue](https://www.npmjs.com/package/bcrypt) -->
<!-- -  [Nodemailer](https://nodemailer.com/about/) -->
<!-- -  [Redis](https://redis.io/) -->
<!-- -  [MongoDB](https://www.mongodb.com/) -->
<!-- -  [Mongoose](https://mongoosejs.com/) -->

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environment.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

### Docker
  Docker is used to handle the project resources, like database and queues services, at development time.
- [Docker installation on Windows](https://docs.docker.com/toolbox/toolbox_install_windows/)
- [Docker installation on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker installation on other OS](https://docs.docker.com/install/linux/)

---

## Install

    $ git clone https://github.com/haple/gympoint-backend
    $ cd gympoint-backend
    $ yarn install

  - ### Install database
    Using docker, run the following command to install the database:
    ```
    sudo docker run -e 'POSTGRES_PASSWORD=UmaSenhaMuitoBoa' \
    -e 'POSTGRES_DB=gympoint'\
    -p 5432:5432 --name gympoint-db \
    -d postgres

    ```


## Configure

Open `./src/config/database.js` then edit it with your database settings. You will need:

- A host;
- A username;
- A password;
- A database;

## Running

    $ yarn dev

<!-- ## Simple build for production

    $ yarn build -->


