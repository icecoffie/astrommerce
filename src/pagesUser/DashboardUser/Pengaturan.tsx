
const Pengaturan = () => {
return (
<div className="bg-[#ffff] font-inter px-10 py-6">
  {/* Account Setting */}
  <section className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-6">
    <h2 className="text-[11px] font-semibold uppercase mb-4 text-[#374151]">Account Setting</h2>
    <div className="flex flex-col md:flex-row md:items-center md:gap-6">
      <div className="flex-shrink-0 mb-6 md:mb-0">
        <div className="w-[96px] h-[96px] rounded-full overflow-hidden bg-[#00296B] flex items-center justify-center">
          <img
            alt="Portrait of a person"
            className="object-cover w-full h-full"
            height="96"
            src="https://storage.googleapis.com/a1aa/image/5a3d163c-c555-4153-9446-250356181803.jpg"
            width="96"
          />
        </div>
      </div>
      <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[13px] text-[#374151]">
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="namaAkun">Nama Akun</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="namaAkun" type="text" value="Kala" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="username">Username</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="username" type="text" value="samalak" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="namaLengkap">Nama Lengkap</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="namaLengkap" type="text" value="Kala Samudera" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="email">Email</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="email" type="email" value="Kevin.gilbert@gmail.com" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="emailKedua">Email Kedua</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="emailKedua" type="email" value="kalasamudera@gmail.com" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="noHp">No HP</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="noHp" type="text" value="+1-202-555-0118" />
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="kewarganegaraan">Kewarganegaraan</label>
          <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="kewarganegaraan">
            <option>Jerman</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="kota">Kota</label>
          <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="kota">
            <option>Munchen</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-normal text-[11px]" htmlFor="kodePos">Kode Pos</label>
          <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="kodePos" type="text" value="1601" />
        </div>
        <div></div>
        <div className="col-span-full md:col-auto">
          <button className="bg-[#00296B] text-white text-[11px] font-semibold px-4 py-2 rounded mt-2 md:mt-0" type="submit">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </section>

  {/* Billing & Shipping Address */}
  <section className="flex flex-col md:flex-row gap-6 my-3">
  {/* Billing Address */}
  <div className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-6 flex-1">
    <h3 className="text-[11px] font-semibold uppercase mb-4 text-[#374151]">
      Billing Address
    </h3>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[13px] text-[#374151]">
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingNamaDepan">
          Nama Depan
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingNamaDepan" type="text" value="Kevin" />
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingNamaBelakang">
          Nama Belakang
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingNamaBelakang" type="text" value="Gilbert" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingAlamat">
          Alamat
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingAlamat" type="text" value="Road No. 13/x, House no. 1320/C, Flat No. 5D" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingNegara">
          Negara
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="billingNegara">
          <option>Bangladesh</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingDaerah">
          Daerah
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="billingDaerah">
          <option disabled selected>
            Select...
          </option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingKota">
          Kota
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="billingKota">
          <option>Dhaka</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingKodePos">
          Kode Pos
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingKodePos" type="text" value="1207" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingEmail">
          Email
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingEmail" type="email" value="kevin12345@gmail.com" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="billingNomorHp">
          Nomor Handphone
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="billingNomorHp" type="text" value="+1-202-555-0118" />
      </div>
      <div className="md:col-span-2">
        <button className="bg-[#00296B] text-white text-[11px] font-semibold px-4 py-2 rounded mt-2" type="submit">
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>

  {/* Shipping Address */}
  <div className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-6 flex-1">
    <h3 className="text-[11px] font-semibold uppercase mb-4 text-[#374151]">
      Shipping Address
    </h3>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[13px] text-[#374151]">
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingNamaDepan">
          Nama Depan
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingNamaDepan" type="text" value="Kevin" />
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingNamaBelakang">
          Nama Belakang
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingNamaBelakang" type="text" value="Gilbert" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingAlamat">
          Alamat
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingAlamat" type="text" value="Road No. 13/x, House no. 1320/C, Flat No. 5D" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingNegara">
          Negara
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="shippingNegara">
          <option>Bangladesh</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingDaerah">
          Daerah
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="shippingDaerah">
          <option disabled selected>
            Select...
          </option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingKota">
          Kota
        </label>
        <select className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151] appearance-none bg-white" id="shippingKota">
          <option>Dhaka</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingKodePos">
          Kode Pos
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingKodePos" type="text" value="1207" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingEmail">
          Email
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingEmail" type="email" value="kevin12345@gmail.com" />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-normal text-[11px]" htmlFor="shippingNomorHp">
          Nomor Handphone
        </label>
        <input className="w-full border border-[#D1D5DB] rounded px-2 py-1 text-[13px] text-[#374151]" id="shippingNomorHp" type="text" value="+1-202-555-0118" />
      </div>
      <div className="md:col-span-2">
        <button className="bg-[#00296B] text-white text-[11px] font-semibold px-4 py-2 rounded mt-2" type="submit">
          Simpen Perubahan
        </button>
      </div>
    </form>
  </div>
</section>

  {/* Change Password */}
<section className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-6 my-3">
  <h3 className="text-[11px] font-semibold uppercase mb-4 text-[#374151]">
    Ubah Kata Sandi
  </h3>
  <form className="space-y-4 text-[13px] text-[#374151] max-w-[600px]">
    <div>
      <label className="block mb-1 font-normal text-[11px]" htmlFor="currentPassword">
        Kata Sandi Saat Ini
      </label>
      <div className="relative">
        <input
          className="w-full border border-[#D1D5DB] rounded px-2 py-1 pr-8 text-[13px] text-[#374151]"
          id="currentPassword"
          type="password"
        />
        <button className="absolute inset-y-0 right-2 flex items-center text-[#6B7280]" type="button">
          <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <div>
      <label className="block mb-1 font-normal text-[11px]" htmlFor="newPassword">
        Kata Sandi Baru
      </label>
      <div className="relative">
        <input
          className="w-full border border-[#D1D5DB] rounded px-2 py-1 pr-8 text-[13px] text-[#374151]"
          id="newPassword"
          placeholder="8+ characters"
          type="password"
        />
        <button className="absolute inset-y-0 right-2 flex items-center text-[#6B7280]" type="button">
          <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <div>
      <label className="block mb-1 font-normal text-[11px]" htmlFor="confirmPassword">
        Konfirmasi Kata Sandi
      </label>
      <div className="relative">
        <input
          className="w-full border border-[#D1D5DB] rounded px-2 py-1 pr-8 text-[13px] text-[#374151]"
          id="confirmPassword"
          type="password"
        />
        <button className="absolute inset-y-0 right-2 flex items-center text-[#6B7280]" type="button">
          <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <div>
      <button className="bg-[#00296B] text-white text-[11px] font-semibold px-4 py-2 rounded mt-2" type="submit">
        Ubah Password
      </button>
    </div>
  </form>
</section>

</div>

);
};

    export default Pengaturan;
