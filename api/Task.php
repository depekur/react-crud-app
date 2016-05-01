<?php 

class Task 
{
	private $db;
	private $tablename = 'ahaha';

	public function __construct() {
			try {
				$config = parse_ini_file("config.ini");
				$this->db = new PDO('mysql:host=' . $config['host'] . ';dbname=crud_app', $config['user'], $config['pass']);

				$this->db -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

	   		$this->db->exec("CREATE TABLE IF NOT EXISTS $this->tablename
		   							(
				                    TaskId INT NOT NULL AUTO_INCREMENT, 
				                    TaskTitle VARCHAR(255) NOT NULL, 
				                    TaskMessage TEXT NOT NULL, 
				                    TaskTime TIMESTAMP,
				                    PRIMARY KEY (TaskId)
			                     ) CHARSET=utf8; "
			                  );		
/*
	   		$this->db->exec("INSERT INTO $this->tablename (TaskTitle, TaskMessage) 
										VALUES ('title', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.')");
*/
			} catch (PDOException $e) { echo $e->getMessage(); }
		
	}

	public function close(){
		$this->db = null;
	}

	/*
	* фильтруем данные
	*/
	public function clearData($data){
		$data = stripslashes($data);
		$data = trim($data);
		$data = strip_tags($data);
		return $data;
	}

	/*
	* принимаем стейтмент, гоним его в массив и отдаем жсон 
	*/
	static private function toJson($sth) {
		$sth->setFetchMode(PDO::FETCH_ASSOC);	
		while($row = $sth->fetch()){
	   	$list[] = $row;
		}
		//echo json_encode($list);
		return $list;
	}

	/*
	* выбираем все таски из базы
	* 1 - активные
	* 0 - архив
	*/
	public function getAll() {

		try {
			$sth = $this->db->prepare("SELECT * FROM $this->tablename ORDER BY TaskId DESC");
		   $sth->execute();

		   return self::toJson($sth);	

		} catch (PDOException $e) { echo $e->getMessage(); }

	}


	/*
	* берем текущее время и айпи жертвы
	* и записываем таску в базу	
	*/
	public function addTask($TaskTitle, $TaskMessage) {

		$insert = "INSERT INTO $this->tablename (TaskTitle, TaskMessage) 
						VALUES (:TaskTitle, :TaskMessage)";

		$stmt = $this->db->prepare($insert);
		$stmt->bindParam(':TaskTitle', $TaskTitle);
		$stmt->bindParam(':TaskMessage', $TaskMessage);
		$stmt->execute();
	}

	public function deleteTask($del) {
		$this->db->exec("DELETE FROM $this->tablename WHERE TaskId='$del'");
	}

	/*
	* берем текущее время (время удаления, завершения таски)
	* меняем поле active на 0, т.е. архивируем 
	*/
	public function toArchive($del) {
		$fin = date('d-m-Y G:i');
		$this->db->exec("UPDATE tasks SET active=0, finish='$fin' WHERE id='$del'");
	}

	/*
	* выбираем последнюю добавленную таску
	* отдаем жсон
	*/
	public function selectLast() {
		try 
		{
		   $sth = $this->db->prepare("SELECT * FROM $this->tablename ORDER BY TaskId DESC LIMIT 1");
		   $sth->execute();

         return self::toJson($sth);

		} catch (PDOException $e) { echo $e->getMessage(); }

	}

}
?>