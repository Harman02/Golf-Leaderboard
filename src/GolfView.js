import React, { useEffect, useState } from "react";
import axios from "axios";

function apiHit(setPlayerInfo) {
   axios.get(
        `https://leaderboard-techtest.herokuapp.com/api/1/events/1000/leaderboard/`,
        {
          headers: {
            authorization: "3FRFGMD7Q4P1EEKPRKOQ",
          },
        }
      ).then(function (response) {
             console.log(response);
             setPlayerInfo(response?.data?.data);

    })
    .catch(function (error) {
      console.log(error);
    })
}

function playerApiHit(setPlayerInfo) {
    axios.get(
        `https://leaderboard-techtest.herokuapp.com/api/1/players/`,
        {
          headers: {
            authorization: "3FRFGMD7Q4P1EEKPRKOQ",
          },
        }
      ).then(function (response) {
             console.log(response);
             setPlayerInfo(response?.data?.data);
             
    })
    .catch(function (error) {
      console.log(error);
    })
}

function getPlayerInfo(id ,setIndividualPlayerInfo) {
    axios.get(
        `https://leaderboard-techtest.herokuapp.com/api/1/events/1000/player/${id}/`,
        {
          headers: {
            authorization: "3FRFGMD7Q4P1EEKPRKOQ",
          },
        }
      ).then(function (response) {
             console.log(response);
             console.log(response, 'individualPlayerInfo');
             setIndividualPlayerInfo(response?.data);
             
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
    
    });
}

function returnThru(n){
    switch(n){
        case 0:
            return '-';
        case 18:
            return 'F';
        default:
            return n;
    }

}

const GolfView = () => {
    const [eventInfo, setEventInfo] = useState([]);
    const [playerInfo, setPlayerInfo] = useState([]);
    const [individualPlayerInfo, setIndividualPlayerInfo] = useState([]);
    
    useEffect(async() => {
       await apiHit(setEventInfo);
       await playerApiHit(setPlayerInfo);

       
    }, []);

    const finalArray = eventInfo?.map((item) => {
       item.player = playerInfo?.find((data) => 
            item.player_id === data.id ? data: null  )
            return item;
    })

    const sortedArray = finalArray.sort((a,b) => 
       {
          if(a.score !== b.score) {
              return a.score - b.score
          }
          else {
              if(a.thru !== b.thru){
                return b.thru - a.thru;
              } else {
                return a.player?.last_name - b.player?.last_name;
              }
              
          }
       } 
    )

    let start = 0;
    let end = finalArray.length;
    while(start < end){
        let temp = start;
        if(finalArray[temp]?.score !== finalArray[start+1]?.score) {
            finalArray[start].pos = start+1;
            start ++;
        } else  {
            while(finalArray[start].score === finalArray[temp].score) {
                finalArray[temp].pos = "T"+ (start+1);
                finalArray[temp+1].pos = "T"+ (start+1)
                temp++;
            }
            start = temp;
        }
    }

    return (
        <div>
        <table style={{ width: '100%' }}>
            <thead>
                <th>Pos</th>
                <th>Player</th>
                <th>Tot</th>
                <th>Score</th>
                <th>Thru</th>
            </thead>
            <tbody>
                {finalArray?.map((item, idx)=> 
                    <tr>
                    <td>{item.pos}</td>
                    <td onClick={() => getPlayerInfo(item.player.id, setIndividualPlayerInfo)}>{item.player?.first_name + ' ' + item.player?.last_name} </td>
                    <td>{item.total}</td>
                    <td>{item.score}</td>
                    <td>{returnThru(item.thru)}</td>
                    </tr>
                )}
            </tbody>
      </table> 
      </div> 
    )
}


export default GolfView;