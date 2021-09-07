package redis_connection

import (
	"context"
	"github.com/go-redis/redis/v8"

	. "back/config"
)

var (
	RedisContext = context.Background()
	RedisClient  *redis.Client
)

func RedisInit() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     Config.Redis.Host,
		Password: Config.Redis.Password,
	})
}
