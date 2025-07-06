using Domain;
using Innofactor.EfCoreJsonValueConverter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configurations
{
    public class ClientEntityTypeConfiguration : BaseEntityTypeConfiguration<Client>
    {
        public override void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.ToTable(nameof(Client));
            builder.Property(b => b.FirstName).IsRequired().HasColumnType("nvarchar(100)");
            builder.Property(b => b.LastName).IsRequired().HasColumnType("nvarchar(100)");
            builder.Property(b => b.PhoneNumber).IsRequired().HasColumnType("nvarchar(15)");
            builder.Property(b => b.DocumentNumber).IsRequired().HasColumnType("nvarchar(20)");
            builder.Property(b => b.Email).IsRequired().HasColumnType("nvarchar(255)");
            builder.Property(b=>b.Address).HasColumnType("varchar(5000)").HasJsonValueConversion();
        }
    }
}
