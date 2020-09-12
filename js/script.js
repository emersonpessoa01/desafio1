// lists
let allUsers = [];
let filteredUsers = [];

// elements
let inputElement = null;
let userListInfoElement = null;

let totalFilteredUsersElement = null;
let totalFilteredFemaleElement = null;
let totalFilteredMaleElement = null;
let totalUsers = null;
let ageSumElement = null;
let ageAverageElement = null;
let button = null;
let showStatisticsElement = null;
let statisticsElement = null;

// statistics
let totalFilteredUsers = 0;
let totalFilteredMale = 0;
let totalFilteredFemale = 0;
let ageSum = 0;
let showStatistics = false;

let numberFormat = Intl.NumberFormat("pt-BR");

window.addEventListener("load", () => {
  selectElements();
  fetchUsers();
});

const selectElements = () => {
  inputElement = document.querySelector("#name");
  inputElement.focus();
  inputElement.addEventListener("input", filterUsers);
  userListInfoElement = document.querySelector("#listInfo");
  totalFilteredUsersElement = document.querySelector("#totalFilteredUsers");
  totalFilteredMaleElement = document.querySelector("#totalFilteredMale");
  totalFilteredFemaleElement = document.querySelector("#totalFilteredFemale");
  ageSumElement = document.querySelector("#ageSum");
  ageAverageElement = document.querySelector("#ageAverage");
  button = document.querySelector("button");
  showStatisticsElement = document.querySelector("#showStatistics");
  showStatisticsElement.addEventListener("click", toggleStatistics);
  statisticsElement = document.querySelector("#statistics");
};

const fetchUsers = async () => {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  allUsers = json.results.map(({ name, dob,gender, picture }) => {
    const fullName = `${name.first} ${name.last}`;
    return {
      fullName,
      age: dob.age,
      gender,
      thumbnail: picture.thumbnail,
    };
  });
};

const filterUsers = () => {
  const name = event.target.value.trim();
  if (!name) {
    filteredUsers = [];
  } else {
    filteredUsers = allUsers.filter((user) => {
      return user.fullName.toLowerCase().includes(name.toLowerCase());
    }).sort((a, b) => {
      return a.fullName.localeCompare(b.fullName);
    });
  }
  calc();
  render();
};

const render = () => {
  list();
  statistics();
};

const list = () => {
  if (!filteredUsers) {
    return;
  }
  let userListHTML = "<ul>";
  filteredUsers.forEach((user) => {
    userListHTML += `
            <li>
                <img class="photo" src="${user.thumbnail}" alt="User photo" />
                <span class="name">${user.fullName}</span>
                <span class="age">| ${user.age} ${user.age > 1 ? "anos" : "ano"}
                </span>
            </li>
      `;
  });
  userListHTML += "</ul>";
  userListInfoElement.innerHTML = userListHTML;
};

const statistics = () => {
  totalFilteredMaleElement.innerHTML = totalFilteredMale;
  totalFilteredFemaleElement.innerHTML = totalFilteredFemale;
  totalFilteredUsersElement.innerHTML = totalFilteredUsers;
  ageSumElement.innerHTML = formatNumber(ageSum);
  ageAverageElement.innerHTML = formatNumber(ageAverage);
};

const calc = () => {
  //code clean
  totalFilteredUsers = filteredUsers.length;
  totalFilteredMale = totalByGender("male");
  totalFilteredFemale = totalByGender("female");
  ageSum = sumAge();
  ageAverage = average();

  // code change
  // totalFilteredMale = filteredUsers.filter((user)=> user.gender === "male").length;
  // totalFilteredMale = filteredUsers.filter((user)=> user.gender === "female").length;
  // ageSum = filteredUsers.reduce((acc, curr) => acc + curr.age, 0);
};

const totalByGender = (gender) =>
  filteredUsers.filter((user) => user.gender === gender).length;

const sumAge = () => filteredUsers.reduce((acc, curr) => acc + curr.age, 0);

const average = () => {
  if (totalFilteredUsers === 0) {
    return 0;
  }
  return ageSum / totalFilteredUsers;
};

const formatNumber = (number) => {
  return numberFormat.format(Number(number).toFixed(2));
};

const toggleStatistics = () => {
  showStatistics = !showStatistics;
  const display = showStatistics ? "block" : "none";
  const buttonAtivate = showStatistics
    ? "Esconder estatísticas"
    : "Mostrar estatísticas";
  statisticsElement.style.display = display;
  showStatisticsElement.innerHTML = buttonAtivate;
};
