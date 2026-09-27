import { useEffect, useState } from "react";
import "./index.css";

const themes = {
  lavender: {
    name: "Lavender",
    primary: "#6d7df5",
    secondary: "#8c7cf6",
  },
  ocean: {
    name: "Ocean",
    primary: "#2699d6",
    secondary: "#4f7df3",
  },
  mint: {
    name: "Mint",
    primary: "#38b889",
    secondary: "#63c99d",
  },
  sunset: {
    name: "Sunset",
    primary: "#f28a55",
    secondary: "#ef667f",
  },
  dark: {
    name: "Dark",
    primary: "#7d8cff",
    secondary: "#9a7cff",
  },
};

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("fittrack_theme") || "lavender"
  );

  const [steps, setSteps] = useState(
    () => Number(localStorage.getItem("fittrack_steps")) || 7600
  );

  const [water, setWater] = useState(
    () => Number(localStorage.getItem("fittrack_water")) || 5
  );

  const [workout, setWorkout] = useState(
    () => Number(localStorage.getItem("fittrack_workout")) || 35
  );

  const [calories, setCalories] = useState(
    () => Number(localStorage.getItem("fittrack_calories")) || 420
  );

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: "💧",
      title: "Hydration reminder",
      text: "You are 3 glasses away from your water goal.",
      time: "Now",
      unread: true,
    },
    {
      id: 2,
      icon: "👟",
      title: "Almost there!",
      text: "You have 2,400 steps left to reach today's goal.",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      icon: "🔥",
      title: "Keep your streak alive",
      text: "Complete a workout today to continue your streak.",
      time: "1 hr ago",
      unread: false,
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activityType, setActivityType] = useState("steps");
  const [activityValue, setActivityValue] = useState("");

  const [mood, setMood] = useState("😄");

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your FitTrack AI Coach. How can I support your wellness today? ✨",
    },
  ]);

  const [chatInput, setChatInput] = useState("");

  const currentTheme = themes[theme];

  const stepGoal = 10000;
  const waterGoal = 8;
  const workoutGoal = 45;
  const calorieGoal = 600;

  const stepPercent = Math.min((steps / stepGoal) * 100, 100);
  const waterPercent = Math.min((water / waterGoal) * 100, 100);
  const workoutPercent = Math.min((workout / workoutGoal) * 100, 100);
  const caloriePercent = Math.min((calories / calorieGoal) * 100, 100);

  const wellnessScore = Math.min(
    Math.round(
      stepPercent * 0.35 +
        waterPercent * 0.2 +
        workoutPercent * 0.25 +
        caloriePercent * 0.2
    ),
    100
  );

  useEffect(() => {
    localStorage.setItem("fittrack_theme", theme);
    localStorage.setItem("fittrack_steps", steps);
    localStorage.setItem("fittrack_water", water);
    localStorage.setItem("fittrack_workout", workout);
    localStorage.setItem("fittrack_calories", calories);
  }, [theme, steps, water, workout, calories]);

  const addSteps = () => {
    setSteps((value) => Math.min(value + 500, 30000));

    addNotification(
      "👟",
      "Activity updated",
      "500 steps have been added to today's progress."
    );
  };

  const addWater = () => {
    if (water < waterGoal) {
      setWater((value) => value + 1);

      addNotification(
        "💧",
        "Great hydration!",
        "You added one glass of water."
      );
    }
  };

  const addWorkout = () => {
    setWorkout((value) => value + 10);
    setCalories((value) => value + 80);

    addNotification(
      "🏋️",
      "Workout logged",
      "10 minutes of activity added to your day."
    );
  };

  function addNotification(icon, title, text) {
    setNotifications((items) => [
      {
        id: Date.now(),
        icon,
        title,
        text,
        time: "Just now",
        unread: true,
      },
      ...items,
    ]);
  }

  const markNotificationsRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false }))
    );
  };

  const handleActivitySubmit = () => {
    const value = Number(activityValue);

    if (!value || value <= 0) return;

    if (activityType === "steps") {
      setSteps((current) => current + value);

      addNotification(
        "👟",
        "Steps logged",
        `${value.toLocaleString()} steps were added.`
      );
    }

    if (activityType === "water") {
      setWater((current) => Math.min(current + value, 20));

      addNotification(
        "💧",
        "Water logged",
        `${value} glass${value > 1 ? "es" : ""} added.`
      );
    }

    if (activityType === "workout") {
      setWorkout((current) => current + value);
      setCalories((current) => current + value * 8);

      addNotification(
        "🏋️",
        "Workout logged",
        `${value} minutes of workout added.`
      );
    }

    setActivityValue("");
    setShowActivity(false);
  };

  const sendChat = () => {
    const message = chatInput.trim();

    if (!message) return;

    setChatMessages((messages) => [
      ...messages,
      { sender: "user", text: message },
    ]);

    setChatInput("");

    setTimeout(() => {
      let response =
        "Keep listening to your body, stay hydrated, and focus on small consistent improvements. 💚";

      const lower = message.toLowerCase();

      if (lower.includes("workout")) {
        response =
          "Try a simple 20-minute routine: 5 minutes warm-up, 10 minutes strength exercises, and 5 minutes stretching. 💪";
      } else if (lower.includes("water") || lower.includes("hydration")) {
        response =
          `You've had ${water} of ${waterGoal} glasses today. Keep a bottle nearby and take small sips throughout the day. 💧`;
      } else if (lower.includes("step")) {
        response =
          `You're at ${steps.toLocaleString()} steps. A short 10–15 minute walk can help you move closer to your ${stepGoal.toLocaleString()} step goal. 👟`;
      } else if (lower.includes("sleep")) {
        response =
          "A consistent sleep schedule can support recovery. Try keeping your bedtime and wake-up time fairly consistent. 😴";
      } else if (lower.includes("motivat")) {
        response =
          "You don't need a perfect day. One small action counts. Drink some water, take a short walk, and keep your streak going. 🔥";
      }

      setChatMessages((messages) => [
        ...messages,
        { sender: "ai", text: response },
      ]);
    }, 600);
  };

  const navItems = [
    { name: "Home", icon: "⌂" },
    { name: "Health", icon: "♡" },
    { name: "Challenges", icon: "♛" },
    { name: "AI Coach", icon: "✦" },
    { name: "Profile", icon: "♙" },
  ];

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div
      className={`app-shell ${theme === "dark" ? "dark-theme" : ""}`}
      style={{
        "--primary": currentTheme.primary,
        "--secondary": currentTheme.secondary,
      }}
    >
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="mobile-header">
        <div className="brand">
          <div className="brand-logo">✦</div>
          <div>
            <strong>FitTrack</strong>
            <span>PRO</span>
          </div>
        </div>

        <button
          className="notification-button"
          onClick={() => {
            setShowNotifications(!showNotifications);
            markNotificationsRead();
          }}
        >
          ♧
          {unreadCount > 0 && <b>{unreadCount}</b>}
        </button>
      </header>

      <main className="app-container">
        <aside className="desktop-sidebar">
          <div className="brand sidebar-brand">
            <div className="brand-logo">✦</div>
            <div>
              <strong>FitTrack</strong>
              <span>PRO</span>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="avatar">M</div>
            <div>
              <strong>Monika</strong>
              <span>Fitness Explorer</span>
            </div>
          </div>

          <nav>
            {navItems.map((item) => (
              <button
                key={item.name}
                className={activePage === item.name ? "active" : ""}
                onClick={() => setActivePage(item.name)}
              >
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          <div className="sidebar-streak">
            <span>🔥</span>
            <div>
              <strong>12 Day Streak</strong>
              <small>Keep going!</small>
            </div>
          </div>

          <button
            className="theme-sidebar-button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
          >
            🎨 Change Theme
          </button>
        </aside>

        <section className="phone-layout">
          <div className="top-header">
            <div className="greeting">
              <div className="avatar large">M</div>

              <div>
                <span>Good evening,</span>
                <h1>Monika 👋</h1>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="round-button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  markNotificationsRead();
                }}
              >
                🔔
                {unreadCount > 0 && <b>{unreadCount}</b>}
              </button>

              <button
                className="round-button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
              >
                🎨
              </button>
            </div>
          </div>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <span>Your fitness updates</span>
                </div>

                <button onClick={() => setNotifications([])}>Clear</button>
              </div>

              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <span>✨</span>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((item) => (
                  <div className="notification-item" key={item.id}>
                    <div className="notification-icon">{item.icon}</div>

                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showThemeMenu && (
            <div className="theme-panel">
              <div className="theme-panel-title">
                <div>
                  <strong>Choose your theme</strong>
                  <span>Personalize your FitTrack experience</span>
                </div>
                <button onClick={() => setShowThemeMenu(false)}>×</button>
              </div>

              <div className="theme-options">
                {Object.entries(themes).map(([key, item]) => (
                  <button
                    key={key}
                    className={theme === key ? "selected-theme" : ""}
                    onClick={() => {
                      setTheme(key);
                      setShowThemeMenu(false);
                    }}
                  >
                    <span
                      style={{
                        background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`,
                      }}
                    />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activePage === "Home" && (
            <HomePage
              wellnessScore={wellnessScore}
              steps={steps}
              water={water}
              workout={workout}
              calories={calories}
              stepPercent={stepPercent}
              waterPercent={waterPercent}
              workoutPercent={workoutPercent}
              mood={mood}
              setMood={setMood}
              addSteps={addSteps}
              addWater={addWater}
              addWorkout={addWorkout}
              setShowActivity={setShowActivity}
              setActivityType={setActivityType}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "Health" && (
            <HealthPage
              steps={steps}
              water={water}
              workout={workout}
              calories={calories}
              wellnessScore={wellnessScore}
            />
          )}

          {activePage === "Challenges" && (
            <ChallengesPage
              steps={steps}
              water={water}
              workout={workout}
            />
          )}

          {activePage === "AI Coach" && (
            <AICoachPage
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              sendChat={sendChat}
            />
          )}

          {activePage === "Profile" && (
            <ProfilePage
              theme={theme}
              setTheme={setTheme}
              setShowThemeMenu={setShowThemeMenu}
            />
          )}

          <button
            className="floating-add"
            onClick={() => setShowActivity(true)}
          >
            +
          </button>

          <div className="bottom-navigation">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={activePage === item.name ? "active" : ""}
                onClick={() => setActivePage(item.name)}
              >
                <span>{item.icon}</span>
                <small>{item.name}</small>
              </button>
            ))}

            <button
              className="bottom-add"
              onClick={() => setShowActivity(true)}
            >
              +
            </button>
          </div>
        </section>
      </main>

      {showActivity && (
        <div className="modal-backdrop" onClick={() => setShowActivity(false)}>
          <div
            className="activity-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span>Quick activity</span>
                <h2>Log something</h2>
              </div>

              <button onClick={() => setShowActivity(false)}>×</button>
            </div>

            <div className="activity-types">
              <button
                className={activityType === "steps" ? "selected" : ""}
                onClick={() => setActivityType("steps")}
              >
                👟
                <span>Steps</span>
              </button>

              <button
                className={activityType === "water" ? "selected" : ""}
                onClick={() => setActivityType("water")}
              >
                💧
                <span>Water</span>
              </button>

              <button
                className={activityType === "workout" ? "selected" : ""}
                onClick={() => setActivityType("workout")}
              >
                🏋️
                <span>Workout</span>
              </button>
            </div>

            <label>
              {activityType === "steps"
                ? "Number of steps"
                : activityType === "water"
                ? "Number of glasses"
                : "Workout minutes"}
            </label>

            <input
              type="number"
              min="1"
              placeholder={
                activityType === "steps"
                  ? "Example: 1000"
                  : activityType === "water"
                  ? "Example: 2"
                  : "Example: 30"
              }
              value={activityValue}
              onChange={(event) => setActivityValue(event.target.value)}
            />

            <button
              className="primary-button full"
              onClick={handleActivitySubmit}
            >
              Add Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage({
  wellnessScore,
  steps,
  water,
  workout,
  calories,
  stepPercent,
  waterPercent,
  workoutPercent,
  mood,
  setMood,
  addSteps,
  addWater,
  addWorkout,
  setShowActivity,
  setActivityType,
  setActivePage,
}) {
  return (
    <>
      <section className="hero-grid">
        <div className="wellness-card">
          <div className="wellness-content">
            <span className="eyebrow">Wellness Score</span>

            <div className="score-row">
              <strong>{wellnessScore}</strong>
              <span>/100</span>
            </div>

            <p>
              {wellnessScore >= 80
                ? "You're doing great — keep going!"
                : "Every small step counts. Keep moving!"}
            </p>
          </div>

          <div className="score-circle">
            <div
              className="score-circle-inner"
              style={{
                background: `conic-gradient(var(--primary) ${
                  wellnessScore * 3.6
                }deg, rgba(255,255,255,.5) 0deg)`,
              }}
            >
              <div>✦</div>
            </div>
          </div>
        </div>

        <div className="mini-health-grid">
          <div>
            <span>🌙</span>
            <small>Sleep</small>
            <strong>85</strong>
            <em>Good</em>
          </div>

          <div>
            <span>🏃</span>
            <small>Activity</small>
            <strong>76</strong>
            <em>Good</em>
          </div>

          <div>
            <span>🌿</span>
            <small>Recovery</small>
            <strong>91</strong>
            <em>Excellent</em>
          </div>

          <div>
            <span>💧</span>
            <small>Hydration</small>
            <strong>{Math.round(waterPercent)}</strong>
            <em>{water >= 6 ? "Good" : "Average"}</em>
          </div>
        </div>
      </section>

      <section className="section-title">
        <div>
          <h2>Today's Plan</h2>
          <p>Small actions, big results.</p>
        </div>

        <button onClick={() => setActivePage("Health")}>See all →</button>
      </section>

      <div className="daily-plan">
        <div className="plant-icon">🌱</div>

        <div className="plan-main">
          <span>Daily Step Goal</span>
          <strong>
            {steps.toLocaleString()} <small>/ 10,000</small>
          </strong>

          <div className="progress-line">
            <div style={{ width: `${stepPercent}%` }} />
          </div>
        </div>

        <span className="percentage">{Math.round(stepPercent)}%</span>

        <button
          className="arrow-button"
          onClick={() => {
            setActivityType("steps");
            setShowActivity(true);
          }}
        >
          →
        </button>
      </div>

      <section className="section-title">
        <div>
          <h2>Your Streaks</h2>
          <p>Consistency creates progress.</p>
        </div>

        <span className="streak-label">🔥 12 days</span>
      </section>

      <div className="streak-grid">
        <div className="streak-card orange">
          <span>🔥</span>
          <strong>12</strong>
          <small>Workout days</small>
        </div>

        <div className="streak-card purple">
          <span>🌙</span>
          <strong>8</strong>
          <small>Sleep days</small>
        </div>

        <div className="streak-card blue">
          <span>💧</span>
          <strong>6</strong>
          <small>Hydration days</small>
        </div>
      </div>

      <section className="quick-actions-section">
        <div className="section-title">
          <div>
            <h2>Quick Actions</h2>
            <p>Update your day instantly.</p>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={addSteps}>
            <span>👟</span>
            <div>
              <strong>+500 Steps</strong>
              <small>Add a quick walk</small>
            </div>
            <b>+</b>
          </button>

          <button onClick={addWorkout}>
            <span>🏋️</span>
            <div>
              <strong>Workout</strong>
              <small>+10 minutes</small>
            </div>
            <b>+</b>
          </button>

          <button onClick={addWater}>
            <span>💧</span>
            <div>
              <strong>Drink Water</strong>
              <small>{water} / 8 glasses</small>
            </div>
            <b>+</b>
          </button>
        </div>
      </section>

      <section className="ai-insight">
        <div className="ai-avatar">🤖</div>

        <div>
          <span>AI INSIGHT ✨</span>
          <strong>
            {steps < 8000
              ? "A short evening walk could help you reach your step goal."
              : "Great activity today! Keep your momentum going."}
          </strong>
          <p>
            Your current activity suggests you're building a healthy routine.
          </p>
        </div>

        <button onClick={() => setActivePage("AI Coach")}>→</button>
      </section>

      <section className="wellness-check">
        <div className="section-title">
          <div>
            <h2>How are you feeling?</h2>
            <p>Your mood helps your AI Coach understand you better.</p>
          </div>
        </div>

        <div className="mood-row">
          {["😄", "🙂", "😐", "😔", "😴"].map((item) => (
            <button
              key={item}
              className={mood === item ? "selected-mood" : ""}
              onClick={() => setMood(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="today-summary">
        <div>
          <span>Calories</span>
          <strong>{calories}</strong>
          <small>/ 600 kcal</small>
        </div>

        <div>
          <span>Workout</span>
          <strong>{workout}</strong>
          <small>/ 45 min</small>
        </div>

        <div>
          <span>Water</span>
          <strong>{water}</strong>
          <small>/ 8 glasses</small>
        </div>
      </section>
    </>
  );
}

function HealthPage({ steps, water, workout, calories, wellnessScore }) {
  const data = [
    ["Steps", steps.toLocaleString(), "10,000", "👟"],
    ["Water", water, "8 glasses", "💧"],
    ["Workout", workout, "45 min", "🏋️"],
    ["Calories", calories, "600 kcal", "🔥"],
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <span>YOUR WELLNESS</span>
        <h1>Health Overview</h1>
        <p>Everything you need to understand today's progress.</p>
      </div>

      <div className="big-health-score">
        <div>
          <span>Overall wellness score</span>
          <strong>{wellnessScore}/100</strong>
          <p>Based on your daily activity, hydration and workout.</p>
        </div>

        <div className="big-score-circle">{wellnessScore}</div>
      </div>

      <div className="health-grid">
        {data.map(([name, value, goal, icon]) => (
          <div className="health-card" key={name}>
            <span className="health-icon">{icon}</span>
            <span>{name}</span>
            <strong>{value}</strong>
            <small>Goal: {goal}</small>
          </div>
        ))}
      </div>

      <div className="sleep-card">
        <div>
          <span>😴 Sleep Recovery</span>
          <h2>7h 20m</h2>
          <p>You had a good recovery night.</p>
        </div>

        <div className="sleep-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function ChallengesPage({ steps, water, workout }) {
  const challenges = [
    {
      title: "Walk 50 km",
      current: Math.min(Math.round(steps / 200), 50),
      goal: 50,
      icon: "🏃",
      color: "purple",
    },
    {
      title: "Complete 10 workouts",
      current: Math.min(Math.round(workout / 10), 10),
      goal: 10,
      icon: "🔥",
      color: "orange",
    },
    {
      title: "Drink water for 20 days",
      current: Math.min(water, 20),
      goal: 20,
      icon: "💧",
      color: "blue",
    },
  ];

  return (
    <div className="page">
      <div className="page-heading challenge-heading">
        <div>
          <span>KEEP PUSHING</span>
          <h1>Challenges</h1>
          <p>Push your limits. Build better habits.</p>
        </div>

        <button className="filter-button">☷</button>
      </div>

      <div className="challenge-tabs">
        <button className="active">Active</button>
        <button>Upcoming</button>
        <button>Completed</button>
      </div>

      <div className="challenge-list">
        {challenges.map((challenge) => {
          const percent = Math.min(
            (challenge.current / challenge.goal) * 100,
            100
          );

          return (
            <div
              className={`challenge-card ${challenge.color}`}
              key={challenge.title}
            >
              <div className="challenge-icon">{challenge.icon}</div>

              <div className="challenge-info">
                <div className="challenge-title">
                  <strong>{challenge.title}</strong>
                  <b>{Math.round(percent)}%</b>
                </div>

                <div className="challenge-progress">
                  <div style={{ width: `${percent}%` }} />
                </div>

                <div className="challenge-meta">
                  <span>
                    {challenge.current} / {challenge.goal}
                  </span>
                  <span>{Math.max(challenge.goal - challenge.current, 0)} left</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="reward-card">
        <span>🏆</span>
        <div>
          <strong>Complete challenges</strong>
          <p>Earn points and unlock new achievements.</p>
        </div>
        <b>+12K</b>
      </div>
    </div>
  );
}

function AICoachPage({
  chatMessages,
  chatInput,
  setChatInput,
  sendChat,
}) {
  return (
    <div className="ai-page">
      <div className="ai-coach-header">
        <div className="ai-orb">🤖</div>
        <span>AI COACH</span>
        <h1>Your personal wellness companion.</h1>
        <p>Ask about workouts, hydration, steps, sleep or motivation.</p>
      </div>

      <div className="suggestion-grid">
        <button
          onClick={() => {
            setChatInput("Give me a workout plan");
          }}
        >
          🏋️
          <span>Workout Plan</span>
        </button>

        <button
          onClick={() => {
            setChatInput("How can I improve my sleep?");
          }}
        >
          🌙
          <span>Better Sleep</span>
        </button>

        <button
          onClick={() => {
            setChatInput("How can I stay motivated?");
          }}
        >
          🌿
          <span>Motivation</span>
        </button>

        <button
          onClick={() => {
            setChatInput("Give me hydration tips");
          }}
        >
          💧
          <span>Nutrition</span>
        </button>
      </div>

      <div className="chat-box">
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === "user" ? "user-message" : ""
              }`}
            >
              {message.sender === "ai" && (
                <span className="chat-ai-icon">✦</span>
              )}
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            placeholder="Ask me anything..."
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendChat();
            }}
          />

          <button onClick={sendChat}>➤</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ theme, setTheme, setShowThemeMenu }) {
  return (
    <div className="page">
      <div className="profile-cover">
        <div className="profile-avatar">M</div>
        <span>Fitness Explorer</span>
        <h1>Monika</h1>
        <p>Building healthy habits one day at a time.</p>
      </div>

      <div className="profile-stats">
        <div>
          <strong>12</strong>
          <span>Day streak</span>
        </div>
        <div>
          <strong>38</strong>
          <span>Workouts</span>
        </div>
        <div>
          <strong>76%</strong>
          <span>Consistency</span>
        </div>
      </div>

      <div className="settings-list">
        <button
          onClick={() => {
            setTheme("dark");
            setShowThemeMenu(false);
          }}
        >
          <span>🌙</span>
          <div>
            <strong>Dark Mode</strong>
            <small>Switch to a darker appearance</small>
          </div>
          <b>{theme === "dark" ? "ON" : "OFF"}</b>
        </button>

        <button onClick={() => setShowThemeMenu(true)}>
          <span>🎨</span>
          <div>
            <strong>App Theme</strong>
            <small>Currently using {theme}</small>
          </div>
          <b>→</b>
        </button>

        <button>
          <span>🔔</span>
          <div>
            <strong>Fitness Reminders</strong>
            <small>Hydration, workout and goal alerts</small>
          </div>
          <b>ON</b>
        </button>

        <button>
          <span>🔒</span>
          <div>
            <strong>Privacy</strong>
            <small>Your activity is stored locally</small>
          </div>
          <b>→</b>
        </button>
      </div>
    </div>
  );
}

export default App;