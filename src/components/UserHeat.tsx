import React from 'react'
import { Helmet } from 'react-helmet'

const UserHeat: React.FC = () => {
  return (
    <Helmet>
      <script type="text/javascript">{`
        (function(add, cla){window['UserHeatTag']=cla;window[cla]=window[cla]||function(){(window[cla].q=window[cla].q||[]).push(arguments)},window[cla].l=1*new Date();var ul=document.createElement('script');var tag = document.getElementsByTagName('script')[0];ul.async=1;ul.src=add;tag.parentNode.insertBefore(ul,tag);})('//uh.nakanohito.jp/uhj2/uh.js', '_uhtracker');_uhtracker({id:'uhxUTlOli3'});
      `}</script>
    </Helmet>
  )
}

export default UserHeat
