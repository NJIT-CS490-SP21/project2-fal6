import unittest, os, sys
sys.path.append(os.path.abspath('../../'))
from app import add_user, leader_board
import unittest.mock as mock
from unittest.mock import patch
import models

INPUT = 'data'
EXPECTED_OUTPUT = 'out'
INITAL_USER = 'Felix'
NAMES = ["Naman", "Kristianna"]

class TestAdd(unittest.TestCase):
    def setUp(self):
        self.sucess_test_params = [
            {
                INPUT: {
                    'name' : 'Me',
                },
                EXPECTED_OUTPUT: {
                    'users': ['Felix','Me'],
                    'length': 2
                }
            },
            {
                INPUT: {
                    'name' : 'Naman',
                },
                EXPECTED_OUTPUT: {
                    'users': ['Felix','Me','Naman'],
                    'length': 1
                }
            },
            {
                INPUT: {
                    'name' : 'Kristianna',
                },
                EXPECTED_OUTPUT: {
                    'users': ['Felix', 'Me','Naman','Kristianna'],
                    'length': 3
                }
            }
        ]
        self.initial_person = models.Player(username=INITAL_USER,points = 100)
        self.initial_db_mock = [self.initial_person]
        
    def mocked_add(self,user):
        self.initial_db_mock.append(user)
    def mocked_db_session_commit(self):
        pass
    def mocked_player_query_all(self):
        return self.initial_db_mock
    def test_click_board(self):
        for test in self.sucess_test_params:
            with patch('app.DB.session.add',self.mocked_add):
                with patch('app.DB.session.commit',self.mocked_db_session_commit):
                    with patch('models.Player.query') as mocked_query:
                        mocked_query.all = self.mocked_player_query_all
                        result = add_user(test[INPUT]['name'])
                        expected_result = test[EXPECTED_OUTPUT]['users']
                        self.assertEqual(result, expected_result)
                        self.assertEqual(len(result),len(expected_result))
          
class TestLeader(unittest.TestCase):
    def setUp(self):
        self.initial_person = models.Player(username=INITAL_USER,points = 101)
        self.initial_players_mock = [self.initial_person]
        self.initial_db_mock = [[self.initial_person.username,self.initial_person.points]]
        self.sucess_test_params = [
            {
                EXPECTED_OUTPUT: self.initial_db_mock
            },
            {
                EXPECTED_OUTPUT: sorted(self.initial_db_mock,key=lambda leaderboard: leaderboard[1], reverse=True)
            },
            {
                EXPECTED_OUTPUT: sorted(self.initial_db_mock,key=lambda leaderboard: leaderboard[1], reverse=True)
            }
        ]
        
        
    def add_user(self,user):
        new_player = models.Player(username=INITAL_USER,points = 99)
        self.intial_db_mock.append([new_player.username,new_player.points])
        self.initial_players_mock.append(new_player)
    def mocked_player_query_all(self):
        return self.initial_players_mock
    def test_click_board(self):
        for count,test in enumerate(self.sucess_test_params):
            with patch('models.Player.query') as mocked_query:
                mocked_query.all = self.mocked_player_query_all
                result = leader_board()
                expected_result = test[EXPECTED_OUTPUT]
                if count <=1:
                    add_user(NAMES[count])
                self.assertEqual(result, expected_result)
                self.assertEqual(len(result),len(expected_result))

if __name__ == '__main__':
    unittest.main()