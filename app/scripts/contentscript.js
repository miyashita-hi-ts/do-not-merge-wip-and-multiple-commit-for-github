(() => {
  'use strict';

  let execCount = 0;
  let isKeepRunning = true;
  let url = null;

  const observer = new MutationObserver(function () {
    if (url != location.href) isKeepRunning = true;
    url = location.href;

    const prPageRegex = /\/pull\//;
    const isPullRequestPage = url.match(prPageRegex);
    if (!isPullRequestPage) { return; }

    let container = document.querySelector('#js-repo-pjax-container');
    let issueTitle = container.querySelector('.js-issue-title').textContent;
    let targetBranch = container.querySelector('span.commit-ref.css-truncate.user-select-contain.expandable.base-ref > a > span').textContent;
    let repositoryName = container.querySelector('h2 > strong > a').textContent;
    let commitNumber = Number(container.querySelector('#commits_tab_counter').textContent);
    let buttonMerges = container.querySelectorAll('.merge-message button[data-details-container]');
    let buttonMergeOptions = container.querySelectorAll('.merge-message button[data-details-container] + .select-menu-button');
    let buttonHtml = '';
    let disabled = false

    if (container == 'null' || buttonMerges.length == 0 || repositoryName == 'null' || isKeepRunning == false) { return; }

    chrome.runtime.sendMessage({from: 'content', subject: 'localStorage'}, function(response){
      if (!response) { return; }

      let localStorage = response.localStorage;
      const wipTitleRegex = /[\[(^](do\s*n[o']?t\s*merge|wip|dnm)[\]):]/i;
      const wipTagRegex = /(wip|do\s*not\s*merge|dnm)/i;
      const isRelatedApollo = repositoryName == 'apollo' || repositoryName == 'apollo-shopping';
      const commitNumberLimit = 2;
      const isNotCombinedCommit = commitNumber > commitNumberLimit;
      const isDevBranch = targetBranch == 'dev';
      const isWipTitle = wipTitleRegex.test(issueTitle);
      const isWipTaskList = container.querySelector('.timeline-comment') && container.querySelector('.timeline-comment').querySelector('input[type="checkbox"]:not(:checked)') !== null;
      let isSquashCommits = false;

      for (const commitMessage of container.querySelectorAll('.commit-message')) {
        isSquashCommits = isSquashCommits || commitMessage.textContent.match(/(squash|fixup)!/);
      }

      let isWipTag = false;
      for (const label of container.querySelectorAll('.js-issue-labels .IssueLabel')) {
        isWipTag = isWipTag || label.textContent.match(wipTagRegex);
      }

      disabled = (isWipTitle || isWipTaskList || isSquashCommits || isWipTag || (isDevBranch && isNotCombinedCommit && isRelatedApollo));

      if (disabled == false) isKeepRunning = false;

      let buttonMessage = '';

      if (localStorage && localStorage.buttonMessage) {
        buttonMessage = localStorage.buttonMessage;
      } else {
        buttonMessage = 'WIP! You can\'t merge!';
      }

      buttonHtml = disabled ? buttonMessage : 'Merge pull request';

      for (const buttonMerge of buttonMerges) {
        buttonMerge.disabled = disabled;
        buttonMerge.innerHTML = buttonHtml;
      }
      for (const buttonMergeOption of buttonMergeOptions) {
        buttonMergeOption.disabled = disabled;
      }
      isKeepRunning = false;
      execCount = 0;
    });

    const maxExecCount = 50;
    execCount = execCount + 1;
    if (execCount > maxExecCount) observer.disconnect();
  })
  observer.observe(document.getElementById('repo-content-pjax-container'), { childList: true, subtree: true })
})();
