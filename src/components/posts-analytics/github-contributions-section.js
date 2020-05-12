import React from 'react'
import GitHubCalendar from 'react-github-calendar'
import ReactTooltip from 'react-tooltip'


const GitHubContributions = () => {

  return (
    <>
      <h2 style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>GitHub contributions</h2>

      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        2018年からのコントリビューションです。
      </div>

      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        <GitHubCalendar
          username="takumon"
          years={[2020, 2019, 2018]}
          fullYear={false}
        >
          <ReactTooltip
            delayShow={50}
            html
          />
        </GitHubCalendar>
      </div>
    </>
  )
}

export default GitHubContributions