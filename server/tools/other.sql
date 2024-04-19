drop table if exits `news`;

create table `news`(

	`id` int(11) not null auto_increment,
	`openid` varchar(100) not null,
	`src` text default null,
	`news` text not null,
	`create_time` timestamp not null default current_timestamp,
	primary key (`id`)

)default charset=`utf8mb4`;