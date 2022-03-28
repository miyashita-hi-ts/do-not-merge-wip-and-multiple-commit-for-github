(() => {
  'use strict';

  function changeMergeButtonState() {
    let container = document.querySelector('#js-repo-pjax-container');
    let issueTitle = container.querySelector('.js-issue-title').textContent;
    let targetBranch = container.querySelector('span.commit-ref.css-truncate.user-select-contain.expandable.base-ref > a > span').textContent;
    let repositoryName = container.querySelector('h1 > strong > a').textContent;
    let commitNumber = Number(container.querySelector('#commits_tab_counter').textContent);
    let buttonMerges = container.querySelectorAll('.merge-message button[data-details-container]');
    let buttonMergeOptions = container.querySelectorAll('.merge-message button[data-details-container] + .select-menu-button');
    let disabled = false;
    let buttonHtml = '';

    chrome.runtime.sendMessage({from: 'content', subject: 'localStorage'}, function(response){
      if (!response) { return; }

      let localStorage = response.localStorage;
      const wipTitleRegex = /[\[(^](do\s*n[o']?t\s*merge|wip|dnm)[\]):]/i;
      const wipTagRegex = /(wip|do\s*not\s*merge|dnm)/i;
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

      // unset variables
      container = null;
      issueTitle = null;
      disabled = null;
      buttonMerges = null;
      buttonMergeOptions = null;
      buttonHtml = null;
      buttonMessage = null;
      localStorage = null;
      isSquashCommits = null;
      isWipTag = null;

      setTimeout(changeMergeButtonState, 1000);
    });
  }

  changeMergeButtonState();
})();
