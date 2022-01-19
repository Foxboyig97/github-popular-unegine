import queryRepositoty from "./scripts/services.js";
import presit from "./scripts/presit.js";

function PopularLanguages({ languages, onUpdate, checked }) {
  return (
    <div className="text-center d-flex justify-content-center my-5">
      {languages?.map((language) => {
        return (
          <li
            className="px-4 py-2 languageItem"
            key={language}
            onClick={() => onUpdate && onUpdate(language)}
            style={{
              color: checked === language ? "rgb(187, 46, 31)" : "black",
            }}
          >
            {language}
          </li>
        );
      })}
    </div>
  );
}

function PopularList({ repositoties, onNextUpdate, checked, canLoadMore }) {
  return (
    <antd.Row>
      <antd.List
        grid={{
          column: 4,
          xs: 2,
          sm: 3,
          md: 4,
          lg: 5,
          xl: 5,
          xxl: 5,
        }}
        itemLayout="horizontal"
        dataSource={repositoties}
        renderItem={(item, index) => (
          <antd.Space key={index} size='small'>
            <div style={{ flexDirection: 'column', alignItems: "center", justifyContent: 'center', display: 'flex' }}>
              <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: "300" }}>#{index + 1}</div>
              <div style={{ width: '150px', height: '150px' }}>
                <antd.Card.Meta
                  avatar={<antd.Image
                    preview={false}
                    src={item?.owner?.avatar_url}
                    style={{ width: '150px', }}
                    alt={`Avatar for ${item?.owner?.login}`} />} />
              </div>
              <div style={{ width: "100%" }}>
                <div className='card_title'>{item?.name?.length > 10 ? `${item?.name?.substr(0, 10)}...` : item?.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className='card_desc'>
                    <div className="fa-li fa fa-star yellow-icon"></div>
                    <span>{item?.stargazers_count} stars</span>
                  </div>
                  <div className='card_desc'>
                    <div className="fa-li fa fa-code-branch blue-icon"></div>
                    <span>{item?.forks_count} forks</span>
                  </div>
                  <div className='card_desc'>
                    <div className="fa-li fa fa-code red-icon"></div>
                    <span>{item?.open_issues_count} open issues</span>
                  </div>
                </div>
              </div>
            </div>
          </antd.Space>

        )}

      />
      {canLoadMore && (
        <div
          style={{
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
          }}
        >
          <antd.Button type='primary' onClick={() => onNextUpdate && onNextUpdate(checked)}>加载更多</antd.Button>
        </div>
      )}
    </antd.Row>
  );
}


function Popular() {
  const [repositoties, setRepositoties] = React.useState([]);
  const [languages] = React.useState(presit.initialLanguages);
  const [canLoadMore, setCanLoadMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(presit.initialPage);
  const [checkedLanguage, setCheckedLanguage] = React.useState(
    presit.initialLanguages[0]
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({});

  const setRepositotiesAsync = (currentLanguage, page, type) => {
    setLoading(true);

    queryRepositoty({ language: currentLanguage, page })
      .then((repositoties) => {
        setError({});
        setCanLoadMore(!repositoties.data?.incomplete_results);

        setRepositoties((previous) => {
          const results =
            type === presit.RepositoriesUpdateStatus.Init
              ? repositoties?.data?.items
              : [...previous, ...repositoties?.data?.items];
          return results;
        });
      })
      .catch((error) => {
        setRepositoties([]);
        setError(error);
        setCanLoadMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNextUpdate = (language) => {
    const nextPage = currentPage + 1;
    setRepositotiesAsync(
      language,
      nextPage,
      presit.RepositoriesUpdateStatus.Add
    );
    setCurrentPage(nextPage);
  };

  React.useEffect(() => {
    setRepositotiesAsync(
      checkedLanguage,
      presit.initialPage,
      presit.RepositoriesUpdateStatus.Init
    );
    setCurrentPage(presit.initialPage);
  }, [checkedLanguage]);

  return (
    <div className="container d-flex flex-column">
      <PopularLanguages
        languages={languages}
        onUpdate={setCheckedLanguage}
        checked={checkedLanguage}
      />
      {error?.errorMessage?.message ? (
        <div className="d-flex align-items-center flex-column">
          <h4>Some mistakes have occurred.</h4>
          <span>{error?.errorMessage?.message}</span>
          <span>
            {" "}
            <a href={error?.errorMessage?.documentation_url}>
              Click here to view the document
            </a>
          </span>
        </div>
      ) : (
        <antd.Spin spinning={loading}>
          <PopularList
            repositoties={repositoties}
            checked={checkedLanguage}
            onNextUpdate={handleNextUpdate}
            canLoadMore={canLoadMore}
          />
        </antd.Spin>
      )}
    </div>
  );
}

function start(container) {
  ReactDOM.render(<Popular />, document.getElementById(container));
}
start("root");
