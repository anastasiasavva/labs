import React from "react";
import axios from "axios";
import moment from "moment";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useHistory,
  useParams
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const request = axios.create({
  baseURL: "http://localhost:8080/",
  paramsSerializer: paramsObj => JSON.stringify(paramsObj)
});

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/employee">Сотрудник</Link>
          </li>
          <li>
            <Link to="/vacation">Отпуск</Link>
          </li>
          <li>
            <Link to="/document">Документ</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const CreatePage = ({ url, children }) => {
  const history = useHistory();
  const [values, setValues] = React.useState({});

  const handleChange = (name, value) =>
    setValues({
      ...values,
      [name]: value
    });

  return (
    <>
      <div className="heading content">
        <div />
        <Link className="button" to={url}>
          Назад
        </Link>
      </div>
      <form
        className="content"
        onSubmit={e => {
          e.preventDefault();
          request.post(url, values).then(() => history.replace(url));
        }}
      >
        <div>
          {React.Children.map(children, child => {
            return React.cloneElement(child, {
              placeholder: child.props.placeholder || child.props.name,
              value: values[child.props.name],
              onChange: event =>
                handleChange(child.props.name, event.target.value)
            });
          })}
        </div>
        <input type="submit" className="button" value="Создать" />
      </form>
    </>
  );
};

/* Сотрудник */

const Employee = () => {
  const history = useHistory();
  const [items, setItems] = React.useState([]);
  const [fetch, setFetch] = React.useState(false);

  const URL = "/employee";

  React.useEffect(() => {
    request.get(URL).then(values => {
      setItems(values.data);
    });
  }, [fetch]);

  return (
    <div className="list">
      <div className="heading content">
        <p>Сотрудник</p>
        <Link className="create button" to={`${URL}/create`}>
          Создать
        </Link>
      </div>
      <table className="content">
        <thead>
          <tr>
            <th>Код сотрудника</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Должность</th>
            <th>Подразделение</th>
            <th>Дата приема</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item["фамилия"]}</td>
              <td>{item["имя"]}</td>
              <td>{item["отчество"]}</td>
              <td>{item["должность"]}</td>
              <td>{item["подразделение"]}</td>
              <td>{moment(item["дата_приема"]).format("DD/MM/YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EmployeeCreate = () => (
  <CreatePage url="/employee">
    <input type="text" name="фамилия" required />
    <input type="text" name="имя" required />
    <input type="text" name="отчество" required />
    <input type="text" name="должность" required />
    <input type="text" name="подразделение" required />
    <input type="date" name="дата_приема" required />
  </CreatePage>
);

/* Отпуск */

const Vacation = () => {
  const history = useHistory();
  const [items, setItems] = React.useState([]);
  const [fetch, setFetch] = React.useState(false);

  const URL = "/vacation";

  React.useEffect(() => {
    request.get(URL).then(values => {
      setItems(values.data);
    });
  }, [fetch]);

  return (
    <div className="list">
      <div className="heading content">
        <p>Отпуск</p>
        <Link className="create button" to={`${URL}/create`}>
          Создать
        </Link>
      </div>
      <table className="content">
        <thead>
          <tr>
            <th>Код отпуска</th>
            <th>Тип</th>
            <th>Оплата</th>
            <th>Льготы</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item["тип"]}</td>
              <td>{item["оплата"]}</td>
              <td>{item["льготы"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const VacationCreate = () => (
  <CreatePage url="/vacation">
    <input type="text" name="тип" required />
    <input type="number" name="оплата" required />
    <input type="number" name="льготы" required />
  </CreatePage>
);

/* Документ */

const Document = () => {
  const [items, setItems] = React.useState([]);
  const [fetch, setFetch] = React.useState(false);

  const URL = "/document";

  React.useEffect(() => {
    request.get(URL).then(values => {
      setItems(values.data);
    });
  }, [fetch]);

  return (
    <div className="list">
      <div className="heading content">
        <p>Документ</p>
        <Link className="create button" to={`${URL}/create`}>
          Создать
        </Link>
      </div>
      <table className="content">
        <thead>
          <tr>
            <th>номер документа</th>
            <th>дата регистрация</th>
            <th>дата начала отпуска товара</th>
            <th>дата окончания отпуска</th>
            <th>код сотрудника</th>
            <th>код отпуска</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item["номер_документа"]}</td>
              <td>{moment(item["дата_регистрация"]).format("DD/MM/YYYY")}</td>
              <td>
                {moment(item["дата_начала_отпуска"]).format("DD/MM/YYYY")}
              </td>
              <td>
                {moment(item["дата_окончания_отпуска"]).format("DD/MM/YYYY")}
              </td>
              <td>{item["код_сотрудника"]}</td>
              <td>{item["код_отпуска"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DocumentCreate = () => {
  const [employyes, setEmployyes] = React.useState([]);
  const [vacations, setVacation] = React.useState([]);

  React.useEffect(() => {
    request.get("/employee").then(values => {
      setEmployyes(values.data);
    });

    request.get("/vacation").then(values => {
      setVacation(values.data);
    });
  }, []);

  return (
    <CreatePage url="/document">
      <input type="number" name="номер_документа" required />
      <input type="date" name="дата_регистрация" required />
      <input type="date" name="дата_начала_отпуска" required />
      <input type="date" name="дата_окончания_отпуска" required />
      <select name="код_сотрудника" required>
        <option value="" disabled selected>
          Сотрудник
        </option>
        {employyes.map(document => (
          <option key={document.id} value={document.id}>
            {document["фамилия"]}
          </option>
        ))}
      </select>
      <select name="код_отпуска" required>
        <option value="" disabled selected>
          Отпуск
        </option>
        {vacations.map(vacation => (
          <option key={vacation.id} value={vacation.id}>
            {vacation["тип"]}
          </option>
        ))}
      </select>
    </CreatePage>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App wrapper">
        <header>
          <div className="container">
            <p>Подготовила: Анастасия Савва</p>
            <Link to="/">Домой</Link>
          </div>
          {/* <Console /> */}
        </header>
        <main>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/employee" component={Employee} />
              <Route exact path="/employee/create" component={EmployeeCreate} />
              <Route exact path="/vacation" component={Vacation} />
              <Route exact path="/vacation/create" component={VacationCreate} />
              <Route exact path="/document" component={Document} />
              <Route exact path="/document/create" component={DocumentCreate} />
              <Redirect to="/" />
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
