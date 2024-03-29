import unittest, os, sys
sys.path.append(os.path.abspath('../../'))
from app import click, reset

INPUT = 'data'
EXPECTED_OUTPUT = 'out'

class TestClick(unittest.TestCase):
    def setUp(self):
        self.sucess_test_params = [
            {
                INPUT: {
                    'board' : [[None, None, None] for i in range(3)],
                    'data' : {
                        'message': [0,0],
                        'shape': 'X',
                    },
                    'turn': False
                },
                EXPECTED_OUTPUT: {
                    'board':[
                        ['X', None, None],
                        [None, None, None],
                        [None, None, None],
                        ],
                    'turn': True
                }
            },
            {
                INPUT: {
                    'board':[
                        ['X', None, None],
                        [None, None, None],
                        [None, None, None],
                        ],
                    'data' : {
                        'message': [1,0],
                        'shape': 'O',
                    },
                    'turn': True
                },
                EXPECTED_OUTPUT: {
                    'board':[
                        ['X', None, None],
                        ['O', None, None],
                        [None, None, None],
                        ],
                    'turn': False
                }
            },
            {
                INPUT: {
                    'board' : [
                        [None, None, None],
                        [None,None,'X'],
                        [None,None,'O'],
                        ],
                    'data' : {
                        'message': [2,1],
                        'shape': 'X',
                    },
                    'turn': False
                    
                },
                EXPECTED_OUTPUT: {
                    'board':[
                        [None, None, None],
                        [None, None, 'X'],
                        [None, 'X', 'O'],
                        ],
                    'turn': True
                }
            }
        ]
    def test_click_board(self):
        for test in self.sucess_test_params:
            result = click(test[INPUT]["board"],test[INPUT]["data"])
            expected_result = (test[EXPECTED_OUTPUT]['board'],test[EXPECTED_OUTPUT]['turn'])
            self.assertEqual(result[0], expected_result[0])
            self.assertEqual(result[1], expected_result[1])
            
class TestReset(unittest.TestCase):
    def setUp(self):
        self.sucess_test_params = [
            {
                INPUT: {
                    'board' : [[None, None, None] for i in range(3)],
                },
                EXPECTED_OUTPUT: {
                    'board': [[None, None, None] for i in range(3)],
                    'turn': False,
                    'win': False
                }
            },
            {
                INPUT: {
                    'board':[
                        ['X', None, None],
                        [None, None, None],
                        [None, None, None],
                        ],
                },
                EXPECTED_OUTPUT: {
                    'board': [[None, None, None] for i in range(3)],
                    'turn': False,
                    'win': False
                }
            },
            {
                INPUT: {
                    'board' : [
                        [None, None, None],
                        [None,None,'X'],
                        [None,None,'O'],
                        ],
                    
                },
                EXPECTED_OUTPUT: {
                    'board': [[None, None, None] for i in range(3)],
                    'turn': False,
                    'win': False
                }
            }
        ]
    def test_click_board(self):
        for test in self.sucess_test_params:
            result = reset(test[INPUT]["board"])
            expected_result = (test[EXPECTED_OUTPUT]['board'],
                                test[EXPECTED_OUTPUT]['turn'],
                                test[EXPECTED_OUTPUT]['win'])
            self.assertEqual(result[0],expected_result[0])
            self.assertEqual(result[1],expected_result[1])
            self.assertEqual(result[2],expected_result[2])
if __name__ == '__main__':
    unittest.main()