<?php
	use \Psr\Http\Message\ServerRequestInterface as Request;
	use \Psr\Http\Message\ResponseInterface as Response;

	require '../vendor/autoload.php';
	require 'Task.php';

	$config['displayErrorDetails'] = true;
	$app = new \Slim\App(["settings" => $config]);

	$app->get('/', function ($request, $response, $args) {

		$task = new Task();		
		$data =  $task->getAll();
		$response = $response->withJson($data)->withHeader('Content-Type', 'application/json');
		return $response;
	});

	$app->post('/', function ($request, $response, $args) {
		$task = new Task();

		if ( $_POST['delete'] == true) {

			$taskID = $task->clearData($_POST['id']);
			$task->deleteTask($taskID);

		} else {

			$TaskTitle = $task->clearData($_POST['TaskTitle']);
			$TaskMessage = $task->clearData($_POST['TaskMessage']);	

			if ($_POST['edit'] == true) {

				$taskID = $task->clearData($_POST['id']);
				$task->updateTask($taskID, $TaskTitle, $TaskMessage);

			}	else {

				$task->addTask($TaskTitle, $TaskMessage);
			}
			
		}

		$data =  $task->getAll();
		$response = $response->withJson($data)->withHeader('Content-Type', 'application/json');

		return $response;
		

	});

	$app->put('/', function ($request, $response, $args) {


		$task = new Task();
		$task->updateTask($args['id']);

		$data =  $task->getAll();
		$response = $response->withJson($data)->withHeader('Content-Type', 'application/json');

		return $response;

	});

	$app->run();
?>