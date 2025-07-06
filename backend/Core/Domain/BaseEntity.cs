﻿using System;

namespace Domain
{
    public class BaseEntity
    {
        public Guid Id { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; private set; }

        public BaseEntity()
        {
            Id = Guid.NewGuid();
        }

        public void SetCreatedAt(DateTime createdAt)
        {
            CreatedAt = createdAt;
        }

        public void SetModifiedAt(DateTime modifiedAt)
        {
            ModifiedAt = modifiedAt;
        }
    }
}
