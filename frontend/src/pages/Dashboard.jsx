import AppLayout from "../components/AppLayout";

function Dashboard() {
  return (
    <AppLayout>
      <div className="dashboard-main">
        <div className="dashboard-content">
          <section className="dashboard-heading">
            <h1>Hej, Elin!</h1>
            <p>Här ser du din progression och dina nivåer.</p>
          </section>

          <section className="dashboard-card level-card">
            <span className="card-label">Din nivå</span>

            <h2>Nivå 2</h2>

            <div className="progress-row">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>

              <span className="progress-percent">70%</span>
            </div>
          </section>

          <section className="dashboard-card next-level-card">
            <span className="card-label">
              Vägen till nästa nivå (Nivå 3)
            </span>

            <div className="requirement-row">
              <div className="requirement-left">
                <span className="check-box checked">✓</span>
                <span>Klara 5 övningar</span>
              </div>

              <span>5/5</span>
            </div>

            <div className="requirement-row">
              <div className="requirement-left">
                <span className="check-box checked">✓</span>
                <span>Klara modul 2</span>
              </div>

              <span>1/1</span>
            </div>

            <div className="requirement-row">
              <div className="requirement-left">
                <span className="check-box"></span>
                <span>Gör färdighetstestet</span>
              </div>

              <span>0/1</span>
            </div>
          </section>

          <section className="dashboard-card levels-card">
            <span className="card-label">Dina nivåer</span>

            <div className="levels">
              <div className="level-box completed">
                <div className="level-status">✓</div>

                <div>
                  <span>Nivå 1</span>
                  <small>Klar</small>
                </div>
              </div>

              <div className="level-line"></div>

              <div className="level-box current">
                <div className="level-number">2</div>

                <div>
                  <span>Nivå 2</span>
                  <small>Aktuell</small>
                </div>
              </div>

              <div className="level-line"></div>

              <div className="level-box locked">
                <div className="lock-icon">▣</div>

                <div>
                  <span>Nivå 3</span>
                  <small>Låst</small>
                </div>
              </div>

              <div className="level-line"></div>

              <div className="level-box locked">
                <div className="lock-icon">▣</div>

                <div>
                  <span>Nivå 4</span>
                  <small>Låst</small>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;