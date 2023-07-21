const { Client } = require("pg");
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new Client({
  user: "postgres",
  host: "192.168.100.24",
  database: "etri",
  password: "etri1234!",
  port: 15432,
});
client.connect();

app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

//로그인
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login/login.html'));
});

app.get('/find-id', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login/find-id.html'));
});

app.get('/find-password', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login/find-password.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login/signup.html'));
});

app.post('/process/Login', (req, res) => {
  const { id, password } = req.body;
  const query = 'SELECT * FROM user_table WHERE id = $1 AND password = $2';

  client.query(query, [id, password], (error, result) => {
    if (error) {
      console.error('로그인 정보 조회 중 오류 발생:', error);
    } else {
      if (result.rowCount === 1) {
        req.session.user = result.rows[0];
        if (result.rows[0].type === "admin") {
          res.redirect('/admin/resource');
        }
        else if (result.rows[0].type === "user") {
          res.redirect('/user/resource');
        }
      }
      else {
        res.redirect('/login');
      } 
    }
  });
});

app.get('/process/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });

  res.redirect('/login');
});

//일반 이용자
app.get('/user/resource', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/user/resource-user.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/site', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/user/site-user.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/system', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/user/system-user.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/settings', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/user/settings-user.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/user/settings/modify', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/user/modify-user.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//관리자
app.get('/admin/resource', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/resource-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/site', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/site-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/system', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/system-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/authority', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/authority-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/logHistory', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/logHistory-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/settings', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/settings-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/settings/modify', (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, '/views/admin/modify-admin.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('리소스 파일 로드 중 오류 발생:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const user = req.session.user;
        const htmlWithData = data.replace('{{user}}', JSON.stringify(user));
        res.send(htmlWithData);
      }
    });
  } else {
    res.redirect('/login');
  }
});

//서버
app.post("/signup", (req, res) => {
  const { id, password, name, email, phone, type, office } = req.body;
  const query = "INSERT INTO user_table (id, password, name, email, phone, type, register_time, office) VALUES ($1, $2, $3, $4, $5, $6, now(), $7)";
  const values = [id, password, name, email, phone, type, office];

  client.query(query, values, (error, result) => {
    if (error) {
      console.error("회원가입 정보 저장 중 오류 발생:", error);
      res.status(500).send("회원가입에 실패했습니다.");
    } else {
      console.log("회원가입 정보 저장 완료");
      res.status(200).send("회원가입이 완료되었습니다.");
    }
  });
});

app.get('/user/all', (req, res) => {
  const query = 'SELECT * FROM user_table ORDER BY register_time ASC';

  client.query(query, (error, result) => {
    if (error) {
      console.error('사용자 정보 조회 중 오류 발생:', error);
      res.status(500).send('사용자 정보를 가져오는데 실패했습니다.');
    } else {
      console.log('사용자 정보 조회 완료');
      res.status(200).json(result.rows);
    }
  });
});

app.put('/user/updateInfo', (req, res) => {
  const { newId, password, name, email, phone, office, oldId } = req.body;
  const query = 'UPDATE user_table SET id = $1, password = $2, name = $3, email = $4, phone = $5, office = $6 WHERE id = $7';
  const values = [newId, password, name, email, phone, office, oldId];

  client.query(query, values, (error, result) => {
    if (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error);
      res.status(500).send('사용자 정보를 업데이트하는데 실패했습니다.');
    } else {
      console.log('사용자 정보 업데이트 완료');
      res.status(200).send('사용자 정보가 업데이트되었습니다.');
    }
  });
});

app.put('/user/updateAuthority', (req, res) => {
  const { readauthority1, writeauthority1, readauthority2, writeauthority2, readauthority3, writeauthority3, readauthority4, writeauthority4, id } = req.body;
  const query = 'UPDATE user_table SET readauthority1 = $1, writeauthority1 = $2, readauthority2 = $3, writeauthority2 = $4, readauthority3 = $5, writeauthority3 = $6, readauthority4 = $7, writeauthority4 = $8 WHERE id = $9';
  const values = [readauthority1, writeauthority1, readauthority2, writeauthority2, readauthority3, writeauthority3, readauthority4, writeauthority4, id];

  client.query(query, values, (error, result) => {
    if (error) {
      console.error('사용자 권한 업데이트 중 오류 발생:', error);
      res.status(500).send('사용자 권한을 업데이트하는데 실패했습니다.');
    } else {
      console.log('사용자 권한 업데이트 완료');
      res.status(200).send('사용자 권한이 업데이트되었습니다.');
    }
  });
});

app.put('/user/updateSession', (req, res) => {
  const { id, password, name, email, phone, office } = req.body;
  const user = req.session.user;
  user.id = id;
  user.password = password;
  user.name = name;
  user.email = email;
  user.phone = phone;
  user.office = office;

  res.status(200).send('세션 정보가 업데이트되었습니다.');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});